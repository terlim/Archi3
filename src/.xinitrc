numlockx &
[[ -f ~/.Xresources ]] && xrdb -merge -I/home/terlim ~/.Xresources
setxkbmap us,ru
setxkbmap -model pc105
setxkbmap -option grp:alt_shift_toggle
#xxkb &
#picom &
exec i3
