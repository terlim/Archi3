numlockx &
[[ -f ~/.Xresources ]] && xrdb -merge -I/home/terlim ~/.Xresources
setxkbmap us,ru -model pc105 -option grp:alt_shift_toggle
#xxkb &
#picom &
exec i3
