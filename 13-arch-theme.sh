#!/usr/bin/env bash
sudo pacman -S capitaine-cursors --noconfirm --needed
sudo pacman -S arc-gtk-theme --noconfirm --needed
yaourt otf-san-francisco-pro
echo "*.font: SF Pro Display 12" >> $HOME/.Xresources
yaourt numix-circle-icon-theme-git
yaourt otf-san-francisco-mono

sudo pacman -S zsh --noconfirm --needed
sh -c "$(wget https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
yaourt nerd-fonts-meslo
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git $ZSH_CUSTOM/themes/powerlevel10k
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
echo "Set ZSH_THEME=powerlevel10k/powerlevel10k in your ~/.zshrc."
echo "Set plugins=(zsh-autosuggestions) in your ~/.zshrc."
echo "Set plugins=(zsh-syntax-highlighting) in your ~/.zshrc."
echo "Set termite font SF Mono 12"
