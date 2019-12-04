#!/usr/bin/env bash

sudo pacman -Suy
mkdir ~/tmp
cd ~/tmp
sudo pacman -S binutils make gcc fakeroot expac yajl git

git clone https://aur.archlinux.org/pacaur.git

cd pacaur/

makepkg -si
cd ..

rm -r tmp