import boto3
import cartopy.crs as ccrs
import matplotlib.pyplot as plt
import numpy as np
import os
import pandas as pd

from dotenv import load_dotenv


def plot(body):

    objectName = body
    base = os.path.dirname(os.path.abspath(body))
    dotenv_path = os.path.join(base, '.env') 
    load_dotenv(dotenv_path)  

    s3 = boto3.client('s3',
            aws_access_key_id = os.getenv("ACCESS_KEY"),
            aws_secret_access_key = os.getenv("SECRET_KEY")
            )
    
    s3 = boto3.client('s3', aws_access_key_id = os.getenv("ACCESS_KEY"), aws_secret_access_key = os.getenv("SECRET_KEY"))
    s3.download_file('merra', objectName, objectName)

    nums = [ x for x in range(577)]

    df = pd.read_csv(objectName, names=nums)
    lons = df.iloc[0,1:].to_numpy()
    lats = df.iloc[1:, 0].to_numpy()


    arr = df.iloc[1:,1:].to_numpy()
    imagename  = objectName[:-4]+".png"


    fig = plt.figure(figsize=(8,4))
    ax = plt.axes(projection=ccrs.Robinson())
    ax.set_global()
    ax.coastlines(resolution="110m",linewidth=1)
    ax.gridlines(linestyle='--',color='black')

    clevs = np.arange(230,311,5)
    plt.contourf(lons, lats, arr, clevs, transform=ccrs.PlateCarree(),cmap=plt.cm.jet)

    plt.title('MERRA-2 Air Temperature ', size=14)
    cb = plt.colorbar(ax=ax, orientation="vertical", pad=0.02, aspect=16, shrink=0.8)
    cb.set_label('K',size=12,rotation=0,labelpad=15)
    cb.ax.tick_params(labelsize=10)

    fig.savefig(imagename, format='png', dpi=360)

    return imagename
