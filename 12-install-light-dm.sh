#!/usr/bin/env bash
#
#
sudo pacman -S lightdm --noconfirm --needed
sudo pacman -S lightdm-gtk-greeter lightdm-gtk-greeter-settings  --noconfirm --needed

sudo systemctl enable lightdm.service