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

cp /etc/pacman.d/mirrorlist ${HOME}/mirrorlist

echo "Server = https://mirror.yandex.ru/archlinux/\$repo/os/\$arch" >> ${HOME}/mirrorlist
sudo cp ${HOME}/mirrorlist /etc/pacman.d/mirrorlist
sudo pacman -S reflector --noconfirm --needed


sudo cp ${HOME}/reflector /etc/systemd/system/reflector.service


sudo systemctl enable reflector.service

rm ${HOME}/reflector
rm ${HOME}/mirrorlist
sudo pacman -Syy
