#!/bin/bash

# Завершить текущие экземпляры picom
killall -q picom

# Ожидание полного завершения работы процессов
while pgrep -u $UID -x picom >/dev/null; do sleep 1; done

# Запуск Picom со стандартным расположением конфигурационного файла в ~/.config/pocom/picom.conf
picom --config $HOME/.config/picom/picom.conf &

