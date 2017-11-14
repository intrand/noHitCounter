#!/usr/bin/python

# generates html file meant to be loaded into OBS Studio as a "BrowserSource" -> Local file; Tested on latest version (v20.0.1) as of 2017-09-24

# install python on windows
# as admin: pip install json2html
# run script from same dir as itself

import json # handle json datatypes
from json2html import * # used for outputting our HTML page (yay python magic)

with open("myrun.json") as run_file: # grab "myrun" data (hardcoded run for example purposes)
	run = json.load(run_file) # load json into python object so we can do stuff

with open("myrun_pb.json") as pb_file: # load up the PB for "myrun" (saved off as myrun_pb.json) -- this was generated when the user hit "save pb!" in the GUI (simulated)
	pb = json.load(pb_file) # load json into python object so we can look at it easily

output_file = str(run["name"]) + ".html"
total, pbtotal = 0, 0 # initiate some ints as 0s
outputsplits, outputhits, outputdiffs, outputpbhits, outputtotal, outputpbtotal = [], [], [], [], [], [] # these are the lists we'll use to output html -- calculated each run of this script :)
for split in run["splits"]: # we need to look at all splits all of the time -- they're always in the output
	for pbsplit in pb["splits"]: # we're going to compare against PB; for simplicity, I'm comparing against ["name"], but there might be a smarter way to do it. Again, a key "order" or "id" might be best.
		if pbsplit["name"] == split["name"]: # if we're comparing the same split from current and PB, do stuff
			total += split["hits"] # keep adding up hits into the total; lots to explain here in a seperate location (maybe a readme? :D)
			pbtotal += pbsplit["hits"] # add up the same but in a pb column -- this doesn't NEED to be shown, and it makes the table wider... we need it for calculations at the end (summary row), not necessarily EVERY row of output
			diff = split["hits"] - pbsplit["hits"] # the difference between now and our PB; lower is better. "negative" differences are to be celebrated -- you got hit less (you did better)
			# print("\n" + split["name"] + ":\n    Current hits taken: " + str(split["hits"]) + "\n    Difference between current run and personal best at this point: " + str(diff) + "\n    Personal best run had this many hits during this split: " + str(pbsplit["hits"]) + "\n    Total hits taken during this run: " + str(total)) # more messy, but more human-readable output if you want to see values easily as you tweak .json files and re-run script
			outputsplits.append(split["name"]) # build a list of split names by adding the current split to the list
			outputhits.append(split["hits"]) # build a list of split hits by adding the current hits to the list
			outputdiffs.append(diff) # build a list of split differences by adding the current difference to the list
			outputpbhits.append(pbsplit["hits"]) # build a list of split hits from pb by adding the matching hits during our PB during this split
			outputtotal.append(total) # build a list of totals by adding the current running total to the list as of this split
			outputpbtotal.append(pbtotal) # build a list of totals from pb by adding the total hits at this split during our PB run

# totaldiff = total - pbtotal # omitted due to laziness
# print("Total, diff, PB total") # debug output to see summary row (below last split)
# print(str(total) + "      " + str(totaldiff) + "  " + str(pbtotal)) # debug output to see summary row (below last split)

output = {} # intialize output dict
output = [{"Split": name, "Hit|": hits, "Diff|": diff, "PB|": pbhit, "Total|": total, "PBTotal": pbtotal} for name, hits, diff, pbhit, total, pbtotal in zip(outputsplits, outputhits, outputdiffs, outputpbhits, outputtotal, outputpbtotal)] # build json using python magic!
# output = [{"Split": name, "Hit": hits, "Diff": diff, "PB": pbhit} for name, hits, diff, pbhit in zip(outputsplits, outputhits, outputdiffs, outputpbhits)] # build json using python magic!
# output = [{"Split": name, "Hit": hits, "Diff": diff, "PB": pbhit, "Total": total} for name, hits, diff, pbhit, total in zip(outputsplits, outputhits, outputdiffs, outputpbhits, outputtotal)] # build json using python magic!
# print(output) # for seeing what that looks like right now
output_html = json2html.convert(json = output, table_attributes="id=\"info-table\"") # convert our json to html using more magic!
output_html = "<html><head><title>" + run["name"] + "</title><meta http-equiv=\"Pragma\" content=\"no-cache\";/><meta http-equiv=\"Expires\" content=\"-1\";/><meta http-equiv=\"refresh\" content=\"1\";/><link rel=\"stylesheet\" href=\"styles.css\"></head><body style=\"background-color:rgba(0, 0, 0, 0.5);color:white;\">" + output_html + "</font></body></html>" # style the output by wrapping it in valid, although basic HTML
f = open(output_file, "w") # write out to myrun.html
f.write(output_html) # write to disk
f.close() # close the file handles
