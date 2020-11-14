source $HOME/.config/nvim/vim-plug/plugins.vim
source $HOME/.config/nvim/general/settings.vim
source $HOME/.config/nvim/keys/mappings.vim
source $HOME/.config/nvim/themes/onedark.vim
source $HOME/.config/nvim/themes/airline.vim
source $HOME/.config/nvim/themes/nerdtreehighlight.vim
luafile $HOME/.config/nvim/lua/plug-colorizer.lua
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTree") && b:NERDTree.isTabTree()) | q | endif
