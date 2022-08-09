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

RUN echo "conda activate myplotenv" > ~/.bashrc

RUN pip install -r requirements.txt && conda install -c conda-forge cartopy

CMD [ "python", "consumer.py"]

