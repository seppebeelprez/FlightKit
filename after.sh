#!/bin/sh

# If you would like to do some extra provisioning you may
# add any commands you wish to this file and they will
# be run after the Homestead machine is provisioned.

# Set timezone to Europe/Brussels
echo "Europe/Brussels" | sudo tee /etc/timezone && sudo dpkg-reconfigure -f noninteractive tzdata
for s in "cli" "fpm"
do
    sudo sed --in-place=.bak 's/date.timezone = UTC/date.timezone = Europe\/Brussels/' /etc/php/7.0/"$s"/php.ini
done
service php7.0-fpm restart
# Fix for Windows host
dos2unix /home/vagrant/.bash_aliases