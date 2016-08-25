#!/bin/bash
#Dcription : restart or start
nodepid=`ps -ef | grep node | grep -v grep | awk '{print $2}'`
if [ -n "$nodepid" ]
then
        kill -9 $nodepid
fi
nohup node app.js > myLog.log 2>&1 &
echo '[ok!]'