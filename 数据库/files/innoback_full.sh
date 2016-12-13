#!/bin/sh
###每周日凌晨4点，执行全量备份
 
base_dir=/ljk/data
 
rm -rf $base_dir/* 2>> $base_dir/all.log    ###清空base_dir，执行全备
 
###备份并将日志记录于base_dir下的all.log
/usr/bin/innobackupex --user=xtrabackup --password=xtrabackup $base_dir 2>> $base_dir/all.log
 
cd $base_dir
#将以'当前时间命名的全备目录'重命名为'0'
mv 20* 0 2>> $base_dir/all.log