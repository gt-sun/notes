#!/bin/sh
###周1--周6凌晨4点 增量备份
 
base_dir=/ljk/data
 
today=`date +%u`
yesterday=`expr $today - 1`
 
echo -e "\n===================================\n" >> $base_dir/increment.log    ###增备日志记录于$base_dir/increment.log
/usr/bin/innobackupex --user=xtrabackup --password=xtrabackup --incremental $base_dir --incremental-basedir=$base_dir/$yesterday 2>> $base_dir/increment.log
 
cd $base_dir
#重命名备份文件，以0 1 2 3 4 5 6 代表周日到 周六
mv 20* $today 2>> $base_dir/increment.log