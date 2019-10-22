!/bin/bash 
sudo ls&&cd ../janus/builder&&make clean&&make&&cd build/&&sudo dpkg -i *
