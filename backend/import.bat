C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE IF NOT EXISTS vehicle_rental;"
C:\xampp\mysql\bin\mysql.exe -u root vehicle_rental < mysql_schema.sql
C:\xampp\mysql\bin\mysql.exe -u root vehicle_rental < sample_data.sql
