#!/bin/bash
set -e
#===========================================
#
#
#
#===========================================

sudo pacman -S --needed --noconfirm wget
sudo pacman -S --needed --noconfirm yajl
cd /tmp
git clone https://aur.archlinux.org/package-query.git
cd package-query/
makepkg -si --noconfirm
cd ..
git clone https://aur.archlinux.org/yaourt.git
cd yaourt/
makepkg -si --noconfirm
cd ..
sudo rm -dR yaourt/ package-query/


