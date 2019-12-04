#!/usr/bin/env bash
#
#
sudo pacman -S lightdm
sudo pacman -S lightdm-gtk-greeter lightdm-gtk-greeter-settings lightdm-webkit-theme-litarvan
sudo systemctl enable lightdm.service