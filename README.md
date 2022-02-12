# ⚠️ This repository may not be what you want ⚠️
Since this tool was created SR has changed the format on their zip files meaning that files zipped with this extension will no longer work. Please instead use something like the following bash script (on linux) to zip your robot files

```bash
mount_point=$(udisksctl mount -b /dev/disk/by-partlabel/ROBOT | cut -d " " -f4 | sed -r 's/\.$//')
zip -rj "$mount_point/robot.zip" usb/*
udisksctl unmount -bf /dev/disk/by-partlabel/ROBOT
# Expects to be run on a system where a device with a partition labelled ROBOT exists, in a directory like so:
#
# - this-script.sh
# - usb/
#   | - robot.py
#   | ...
#
# All files in usb/ will be included on the zip; you must remember to include a robot.py file.
```

# Student Robotics ZIP Creator

Creates ZIP containing student robotics code to be placed on USB sticks.

Clicking the button on the status bar packages the workspace into a Student Robotics ZIP. The file is then copied to a USB stick if one is plugged in.
