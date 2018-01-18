
FROM mongo:latest

# Modify child mongo to use /data/db2 as dbpath (because /data/db wont persist the build)
RUN mkdir -p /data/db2 \
    && echo "dbpath = /data/db2" > /etc/mongodb.conf \
    && chown -R mongodb:mongodb /data/db2

COPY ies-sis-db /data/db2

CMD ["mongod"]

# ,"--journal --storageEngine=mmapv1 --dbpath /data/db2"] 

#CMD ["/bin/script.sh"]

 
