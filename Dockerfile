FROM python:3

WORKDIR /teamai53-22
RUN chown -R 1000:1000 /teamai53-22

COPY requirements.txt .
COPY TeamBackend TeamBackend
COPY myapp /teamai53-22/myapp


COPY predictionTime.py /teamai53-22/
COPY model_filename.pkl /teamai53-22/
COPY user_feature_list.pkl /teamai53-22/
COPY user_features.pkl /teamai53-22/
COPY games_df.pkl /teamai53-22/
COPY item_features.pkl /teamai53-22/
COPY dataset_filename.pkl /teamai53-22/

COPY createDbModel.py /teamai53-22/
COPY createDummyData.py /teamai53-22/

RUN pip install lightfm --upgrade --ignore-installed scipy
RUN pip install --trusted-host pypi.python.org -r requirements.txt
RUN pip install gunicorn
