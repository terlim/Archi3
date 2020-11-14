#
# ~/.bash_profile
#
export TERM=xterm-256color
[[ -f ~/.bashrc ]] && . ~/.bashrc

[[ $(fgconsole 2>/dev/null) == 1 ]] && startx --vt1
