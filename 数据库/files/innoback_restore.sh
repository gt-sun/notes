#!/bin/sh
 
###检查上次命令执行是否成功的函数
function check {
   if [ $? -ne 0 ];then
        echo -e "\e[1;31m\n $1 exec failed,please check it !\e[0m \n"
        echo "$1 failed,please check it !"
        sleep 1
        exit -1
   fi
}
 
base_dir=/ljk/data
 
backup_dir=`ls -l $base_dir|grep -e "^d.*"|awk '{print $NF}'`
echo -e "the backup dir is: $backup_dir \n"
sleep 1
 
###开始恢复
 
cd $base_dir
 
echo -e "------ 准备阶段 0 ------\n"
sleep 1
/usr/bin/innobackupex --apply-log --redo-only $base_dir/0
check "准备阶段 0";
 
###执行除去 0 和 最后一个目录 之外的其他目录的恢复准备
dir_num=`ls -l $base_dir|grep -e "^d.*"|wc -l`      #取出有几个备份目录
 
for i in `seq 1 $(($dir_num - 2))`
  do
    echo -e "------ 准备阶段 $i ------ \n"
    sleep 1
    /usr/bin/innobackupex --apply-log --redo-only $base_dir/0 --incremental-dir=$base_dir/$i
    check "准备阶段 $i";
done
 
###最后一个增量备份
echo -e "------ 准备阶段 $(($dir_num - 1)) ------ \n"
sleep 1
/usr/bin/innobackupex --apply-log $base_dir/0 --incremental-dir=$base_dir/$(($dir_num - 1))
check "准备阶段 $(($dir_num - 1))";
 
###以上步骤将所有增量备份中记录的变化应用到了最初的全量备份中
echo -e "------ 应用所有变化到$base_dir/0 ------\n"
/usr/bin/innobackupex --apply-log $base_dir/0
check "应用所有变化到$base_dir/0"；
 
###将数据考回数据目录
echo -e "------ 将处理好的数据考回至数据目录 ------\n"
/usr/bin/innobackupex --copy-back $base_dir/0
check "copy-back";