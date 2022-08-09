FROM python:3.8
FROM continuumio/miniconda3

WORKDIR /app

COPY . .

RUN true 

COPY environment.yml .

RUN true

COPY example.env .env

RUN conda env create -f environment.yml

RUN conda init bash

RUN echo "conda activate myenv" > ~/.bashrc


RUN pip install -r requirements.txt && conda install -c conda-forge cartopy

RUN touch $HOME/.netrc 
RUN echo "machine urs.earthdata.nasa.gov login tanukansalearthdata password EarthData@123" >> $HOME/.netrc
RUN chmod 0600 $HOME/.netrc
RUN touch $HOME/.urs_cookies

CMD [ "python", "main.py"]

