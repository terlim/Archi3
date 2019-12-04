#!/bin/bash
set -e
#=========================================================
#
#
#
#
#=========================================================
echo "====================================="
echo "=  install xorg-server              ="
echo "====================================="
sudo pacman -S xorg-server xorg-xinit --noconfirm --needed
sudo pacman -S virtualbox-guest-utils --noconfirm --needed
sudo pacman -S termite --noconfirm --needed
sudo pacman -S xorg-twm --noconfirm --needed
sudo pacman -S xss-lock --noconfirm --needed

sudo pacman -S xorg-fonts-misc --noconfirm --needed
sudo pacman -S xorg-fonts-type1 --noconfirm --needed
sudo pacman -S xorg-fonts-100dpi --noconfirm --needed
sudo pacman -S xorg-fonts-75dpi --noconfirm --needed
sudo pacman -S ttf-droid ttf-dejavu --noconfirm --needed
sudo pacman -S --noconfirm --needed numlockx

echo "====================================="
echo "=  install i3-gaps                  ="
echo "====================================="
sudo pacman -S --noconfirm --needed i3-gaps
sudo pacman -S --noconfirm --needed i3lock
sudo pacman -S --noconfirm --needed i3status

sudo pacman -S networkmanager network-manager-applet nm-connection-editor --noconfirm --needed
sudo systemctl enable NetworkManager

mkdir $HOME/.config/termite
cp ./src/termite/config $HOME/.config/termite/config
echo "numlockx &" > ${HOME}/.xinitrc
echo "[[ -f ~/.Xresources ]] && xrdb -merge -I${HOME} ~/.Xresources" >> ${HOME}/.xinitrc
echo "setxkbmap us,ru" >> ${HOME}/.xinitrc
echo "setxkbmap -model pc105" ${HOME}/.xinitrc

echo "exec i3" >> ${HOME}/.xinitrc
pacman -Rsn $(pacman -Qdtq) rxvt-unicode
startx