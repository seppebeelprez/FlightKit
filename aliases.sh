alias ..="cd .."
alias ...="cd ../.."

alias h='cd ~'
alias c='clear'
alias artisan='php artisan'
alias console='php app/console'
alias p='cd ~/flightkit.dev'

alias phpspec='vendor/bin/phpspec'
alias phpunit='vendor/bin/phpunit'
alias serve=serve-laravel

# Convenience aliases
alias composer_reset='rm -rf /home/vagrant/.config/composer/'
alias composer_update='sudo composer self-update'
alias db='MYSQL_PWD=secret mysql --user=homestead'
alias upgrade='sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get dist-upgrade && sudo apt-get autoremove -y'
alias sr='service nginx restart && service php7.0-fpm restart'

# Preserve environment variables for Super User Do
alias sudo='sudo -E'

# Webroot folders aliases
alias cmp='cd ~/cmp.local/'
alias cmp1='cd ~/cmp1.local/'
alias cmp2='cd ~/cmp2.local/'
alias cmp3='cd ~/cmp3.local/'
alias demo='cd ~/demo.local/'
alias mma='cd ~/mma.local/'
alias nmdad2='cd ~/nmdad2.local/'
alias nmdad3='cd ~/nmdad3.local/'

export PATH=/home/vagrant/.config/composer/vendor/bin/:$PATH

function serve-laravel() {
    if [[ "$1" && "$2" ]]
    then
        sudo dos2unix /vagrant/scripts/serve-laravel.sh
        sudo bash /vagrant/scripts/serve-laravel.sh "$1" "$2" 80
    else
        echo "Error: missing required parameters."
        echo "Usage: "
        echo "  serve domain path"
    fi
}

function serve-hhvm() {
    if [[ "$1" && "$2" ]]
    then
        sudo dos2unix /vagrant/scripts/serve-hhvm.sh
        sudo bash /vagrant/scripts/serve-hhvm.sh "$1" "$2" 80
    else
        echo "Error: missing required parameters."
        echo "Usage: "
        echo "  serve-hhvm domain path"
    fi
}

# Artevelde University College Ghent proxy server on/off
function proxy() {
    case "$1" in
        on)
            PXY=http://proxy.arteveldehs.be:8080
            NOPXY=localhost,127.0.0.1,.local
            export HTTP_PROXY=$PXY HTTPS_PROXY=$PXY FTP_PROXY=$PXY NO_PROXY=$NOPXY http_proxy=$PXY https_proxy=$PXY ftp_proxy=$PXY no_proxy=$NOPXY
            unset PXY NOPXY
            echo "Artevelde University College Ghent proxy server settings are SET"
            ;;
        off)
            unset HTTP_PROXY HTTPS_PROXY FTP_PROXY NO_PROXY http_proxy https_proxy
            echo "Artevelde University College Ghent proxy server settings are UNSET"
            ;;
        *)
            echo "Error: missing required parameter."
            echo "Usage: "
            echo "  proxy on"
            echo "  proxy off"
            echo "Proxy Server Settings: $HTTP_PROXY | Proxy Server Exceptions: $NO_PROXY"
            ;;
    esac
}