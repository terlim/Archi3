#!/bin/bash
set -e
#===================================================#
#                                                   #
# Add Yandex mirror to mirrorlist                   #
# and add service sort mirrorlist                   #
#                                                   #
#===================================================#

echo "======================================="
echo "=    Add Yandex mirror to mirrorlist  ="
echo "======================================="

sudo pacman -S reflector --noconfirm --needed

yaourt reflector-timer

sudo cp ./src/reflector.conf /usr/share/reflector-timer/reflector.conf
sudo systemctl start reflector.timer
sudo pacman -Syy
