#!/usr/bin/env bash
set -e
###
#
#
##


sudo pacman -S --noconfirm --needed rofi


if [[ ! -d ${HOME}/.config ]]; then
    mkdir ${HOME}/.config
fi

if [[ ! -d ${HOME}/.config/i3 ]]; then
    mkdir ${HOME}/.config/i3
fi

cp ${HOME}/.config/i3/config ${HOME}/.config/i3/config_old
sed -i 's/dmenu_run/--no-startup-id rofi -show drun -show-icons/g' ${HOME}/.config/i3/config

sudo pacman -S htop --noconfirm --needed
sudo pacman -S ranger --noconfirm --needed
sudo pacman -S curl --noconfirm --needed
sudo pacman -S unrar zip unzip arj --noconfirm --needed
sudo pacman -S lxappearance --noconfirm --needed
echo "system reboot after 5seconds"
sleep 5
sudo reboot