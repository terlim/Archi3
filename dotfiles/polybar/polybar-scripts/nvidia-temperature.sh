#!/bin/sh

nvidia-settings -q 'GPUCoreTemp' | grep gpu:0 | awk '{print substr($4, 0, length($4))}' | sed 's/./°C/3' | sed 's/  $//'  
