# Source: https://unidata.github.io/python-gallery/examples/Nexrad_S3_Demo.html#plot-the-data


from logging import raiseExceptions
from botocore.client import Config
import matplotlib.pyplot as plt
from metpy.io import Level2File
from metpy.plots import add_timestamp, ctables
from mpl_toolkits.axes_grid1 import make_axes_locatable
import numpy as np
import os
import nexradaws
import datetime
import asyncio
import pika
import json
from deleteFiles import deleteLocalFiles
from uploadImages import uploadImage

async def getPlottingDataController( filters ):
    print(filters)
    if filters == None or len(filters) <=6 :
        print("Data not of full length")
        return None
    
    year = filters['year']
    month = filters['month']
    day = filters['day']
    STATION = filters['station']
    hour = filters['hour']
    minute = filters['minute']
    second = filters['second']
 
    if not isinstance(year, str) or not isinstance(month, str) or not isinstance(day, str) or not isinstance(STATION, str) or not isinstance(hour, str) or not isinstance(minute, str) or not isinstance(second, str):
        print("Data types Not Proper")
        return None
    try:
        """ABSOLUTES"""
        DirectoryPath = os.path.dirname(os.path.abspath(__file__)) 

        """MAKING AN END TIME"""
        # Convert Input String to   int

        current = datetime.datetime(int(year), int(month), int(day), int(hour), int(minute), int(second) )
        start = current - datetime.timedelta(days=1)

        # print(f'CURRENT TIME:', current)
        # print(f'START TIME: ', start )

        """Downloading the latest available file"""
    
        conn = nexradaws.NexradAwsInterface()

        scans = conn.get_avail_scans_in_range(start, current, STATION)
        
        # print("SCANS: ",scans)

        toBeDownloaded = ""

        for i in range(len(scans) - 1, -1, -1):
            key = scans[i].key.split("/")[-1]
            if key[-3:] != "MDM":
                toBeDownloaded = scans[i]
                break
            else:
                print("skipping data set", key)

        if toBeDownloaded == "":
            print("tobeDownloaded is different")
            raise Exception

        dataFileName = toBeDownloaded.key.split("/")[-1]

        results = conn.download(toBeDownloaded, DirectoryPath)
        
        # for scan in results.iter_success():
        #     print ("{} volume scan time {}".format(scan.radar_id,scan.scan_time ))
        print("File downloaded")
        """CODE FOR PLOTTING"""
        try:
            f = Level2File(dataFileName)
        except:
            print("Error in File Reading")
            return  None
    except Exception as e:
        print("Error while scanning and downloading data: ", e )
        return None

    print("Scanning and plotting.")
    try:
        sweep = 0

        # First item in ray is header, which has azimuth angle
        az = np.array([ray[0].az_angle for ray in f.sweeps[sweep]])

        ref_hdr = f.sweeps[sweep][0][4][b'REF'][0]
        ref_range = np.arange(ref_hdr.num_gates) * ref_hdr.gate_width + ref_hdr.first_gate
        ref = np.array([ray[4][b'REF'][1] for ray in f.sweeps[sweep]])

        rho_hdr = f.sweeps[sweep][0][4][b'RHO'][0]
        rho_range = (np.arange(rho_hdr.num_gates + 1) - 0.5) * rho_hdr.gate_width + rho_hdr.first_gate
        rho = np.array([ray[4][b'RHO'][1] for ray in f.sweeps[sweep]])

        phi_hdr = f.sweeps[sweep][0][4][b'PHI'][0]
        phi_range = (np.arange(phi_hdr.num_gates + 1) - 0.5) * phi_hdr.gate_width + phi_hdr.first_gate
        phi = np.array([ray[4][b'PHI'][1] for ray in f.sweeps[sweep]])

        zdr_hdr = f.sweeps[sweep][0][4][b'ZDR'][0]
        zdr_range = (np.arange(zdr_hdr.num_gates + 1) - 0.5) * zdr_hdr.gate_width + zdr_hdr.first_gate
        zdr = np.array([ray[4][b'ZDR'][1] for ray in f.sweeps[sweep]])


        # Get the NWS reflectivity colortable from MetPy
        ref_norm, ref_cmap = ctables.registry.get_with_steps('NWSReflectivity', 5, 5)

        # Plot the data!
        fig, axes = plt.subplots(2, 2, figsize=(15, 15))
    except Exception as e:
        print("Error while arranging Data configuration",e)
        return None

    try: 
        
        for var_data, var_range, colors, lbl, ax in zip((ref, rho, zdr, phi),
                                                        (ref_range, rho_range, zdr_range, phi_range),
                                                        (ref_cmap, 'plasma', 'viridis', 'viridis'),
                                                        ('REF (dBZ)', 'RHO', 'ZDR (dBZ)', 'PHI'),
                                                        axes.flatten()):
            try:
                # Turn into an array, then mask
                data = np.ma.array(var_data)
                data[np.isnan(data)] = np.ma.masked

                # Convert az,range to x,y
                xlocs = var_range * np.sin(np.deg2rad(az[:, np.newaxis]))
                ylocs = var_range * np.cos(np.deg2rad(az[:, np.newaxis]))

                # Define norm for reflectivity
                norm = ref_norm if colors == ref_cmap else None

                # Plot the data
                a = ax.pcolormesh(xlocs, ylocs, data, cmap=colors, norm=norm)

                divider = make_axes_locatable(ax)
                cax = divider.append_axes('right', size='5%', pad=0.05)
                fig.colorbar(a, cax=cax, orientation='vertical', label=lbl)

                ax.set_aspect('equal', 'datalim')
                ax.set_xlim(-100, 100)
                ax.set_ylim(-100, 100)
                add_timestamp(ax, f.dt, y=0.02, high_contrast=False)
            except Exception as e:
                print(f"Exception raised e: {e}")
    
        try:
            plt.suptitle('KVWX Level 2 Data', fontsize=20)
            plt.tight_layout()


            pltLocalFileName = str("local") + "_" + dataFileName + ".png"

            plt.savefig(pltLocalFileName, bbox_inches='tight')
        except Exception as e:
            print("Exception raised while saving the image to local storage", e)
            return None
        try:
            
            print("Uploading image")
            ### CODE TO UPLOAD TO Online Service.
            done, pending = await asyncio.wait([uploadImage(pltLocalFileName, dataFileName)])

            for t in done:
                result = t.result()
        except Exception as e:
            print("Error generted while uploading file", e)
            return None
        
        print("Deleting local files")
        ### CODE FOR DELETING THE DOWNLOADED FILE.
        deleteLocalFiles( dataFileName, pltLocalFileName )

        return result
    except Exception as e:
        print(f'Exception Raised {e}')
        return None