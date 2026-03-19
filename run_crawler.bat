@echo off
cd /d E:\Projects\fastimgtool
python check_titles.py https://fastimgtool.com "titles_%date:~-4,4%%date:~-10,2%%date:~-7,2%.csv"