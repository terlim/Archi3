#!/bin/bash
export LANG="ru_RU.UTF-8"
/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1 &
numlockx &
setxkbmap us,ru -model pc105 -option grp:alt_shift_toggle &
