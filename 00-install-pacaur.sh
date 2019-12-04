#!/usr/bin/env bash

sudo pacman -Suy
mkdir ~/tmp
cd ~/tmp
sudo pacman -S binutils make gcc fakeroot expac yajl git

curl -o PKGBUILD https://aur.archlinux.org/cgit/aur.git/plain/PKGBUILD?h=cower
makepkg --needed --noconfirm --skippgpcheck -sri

curl -o PKGBUILD https://aur.archlinux.org/cgit/aur.git/plain/PKGBUILD?h=pacaur
makepkg --needed --noconfirm --skippgpcheck -sri

cd ..

rm -r tmp