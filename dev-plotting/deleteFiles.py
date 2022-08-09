import os

def deleteLocalFiles( dataFileName , pltLocalFileName ) : 
    DirectoryPath = os.path.dirname(os.path.abspath(__file__)) 
    ### CODE FOR DELETING THE DOWNLOADED FILE.
    try:
        if os.path.isfile(DirectoryPath + '/' + dataFileName):
            os.remove(dataFileName)
    except Exception as e:
            print("Exception raised while deleting the downloaded file",e)

    try:    
        if os.path.isfile(DirectoryPath + '/' + pltLocalFileName):
            os.remove(pltLocalFileName)
    except Exception as e:
        print("Exception raised while deleting the downloaded file",e)
        
    return True