cd ~/janus/machinekit
debian/configure -prx
sudo mk-build-deps -ir
cd src
./autogen.sh
./configure --with-xenomai
make
sudo make setuid
sudo adduser mk xenomai
