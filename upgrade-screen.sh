#!/bin/bash
echo "start deploy ..."

# È¹ûupĿ¼²»´æ£¬Ô×¶¯´´½¨£¬ÓÓ´æ¹ý¾
if [ ! -d "backup" ];then
    mkdir backup
fi

Date=`date +%Y%m%d.%H%M`

# È¹ûboardĿ¼Ò´æ£¬ÔÖÃÃ²¢Ò¶¯µ½backupĿ¼Ï
if [ -d "screen" ];then
    mv screen backup/screen."$Date"
    echo "mv screen backup/screen.$Date"
fi

# ½â·¢²¼×Ð°汾
unzip screen.zip

ls -l
