from netCDF4 import Dataset
import os
import numpy as np

def dataConversion(file, hour):

    print("Converging data...")
    hour = int(hour)
    data = Dataset(file, mode='r')

    lons = data.variables['lon'][:]
    lats = data.variables['lat'][:]
    T2M = data.variables['TLML'][:,:,:]
    T2M = T2M[hour,:,:]

    filename = file + ".csv"
    temp = np.array(T2M)
    A = np.vstack([lons, temp])
    lats = np.append(0, lats)
    latsflat = np.reshape(lats, (-1, 1))
    csv_file = np.hstack((latsflat, A))
    np.savetxt(filename, csv_file, delimiter=",")
    
    data.close()
    os.remove(file)
    print('DELETED')

    return filename


