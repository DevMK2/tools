#!/bin/bash 
#sudo ls&&cd ~/gazebo/gazebo/build/&&make clean&&cmake ..&&make -j8&&sudo make install
sudo ls&&cd ~/gazebo/gazebo/build/&&make -j8&&sudo make install

# gazebo/gazebo/build/gazebo/gazebo_config.h -> #define ENABLE_DIAGNOSTICS
