import requests
    
def fetchdata(getValue):
    print("Fetching data...")

    domain = "https://goldsmr4.gesdisc.eosdis.nasa.gov/data/MERRA2/M2I1NXLFO.5.12.4/"
    year = getValue["year"]
    month = str(getValue["month"]).zfill(2)
    day = str(getValue["day"]).zfill(2)

    subdomain = year+"/"+month+"/"+"MERRA2_400.inst1_2d_lfo_Nx."+year+month+day+".nc4"

    URL = domain+subdomain
    FILENAME = year+"-"+month+"-"+day+".nc4"

    result = requests.get(URL)
    print(result.status_code, type(result.status_code))
    
    if result.status_code != 200:
        print("Merra Data not downloaded")
        return None

    
    try:
        result.raise_for_status()
        f = open(FILENAME,'wb')
        f.write(result.content)
        f.close()
        print('contents of URL written to '+FILENAME)
    except:
        print('requests.get() returned an error code '+str(result.status_code))

    
    return FILENAME