numlockx &
[[ -f ~/.Xresources ]] && xrdb -merge -I/home/terlim ~/.Xresources
setxkbmap us,ru
setxkbmap -model pc105
exec i3
