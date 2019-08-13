# TOON MATERIAL BATCH CONVERSION SCRIPT
#
# BY: ROBERTT
# DATE CREATED: JANUARY 2006
# SCRIPT VERSION: 1.0
# DESIGNED/TESTED ON BLENDER VERSION: 2.40
#
# WHAT THIS BLENDER PYTHON SCRIPT CAN DO:
#
# THIS SCRIPT CHANGES *ALL* MATERIALS IN YOUR
# CURRENTLY OPEN BLEND FILE TO TOON MATERIALS.
# AFTER EXECUTING, CHECK THE BLENDER CONSOLE
# FOR SCRIPT OUTPUT.
#
# AS THIS SCRIPT ALTERS *ALL* OF YOUR MATERIAL
# SETTINGS IN YOUR CURRENTLY OPENED BLEND FILE,
# YOU SHOULD *NOT* RUN IT ON A PROJECT THAT HAS
# NOT BEEN SAVED YET!  CHANGES MADE TO MATERIALS
# WHILE USING THIS SCRIPT CANNOT BE UNDONE!
#
# NOTE: CHANGES ARE NOT PERMANENTLY COMMITED
# TO YOUR BLEND FILE UNLESS YOU CHOOSE TO SAVE
# YOUR FILE AFTER EXECUTING THIS SCRIPT.
#
# USAGE TERMS:  USE THIS SCRIPT FREELY,
# AT YOUR OWN RISK, AND ADAPT AS YOU WISH.


import Blender

from Blender import Material, Scene
from Blender.Scene import Render

print "\nTOON MATERIAL CONVERSION SCRIPT V1.0 STARTED...\n"

# Get list of active materials from Blender
materials = Blender.Material.Get()

# Get render information needed for edge setting
scn = Scene.GetCurrent()
context = scn.getRenderingContext()

print "PROGRESS: CONVERTING ALL MATERIALS TO TOON TYPE..."

# Change materials to Toon Diffuse/Specular
for m in materials:

	# Diffuse Shader (2 = Toon)
	m.setDiffuseShader(2)

	# Specular Shader (3 = Toon)
	m.setSpecShader(3)

	# THE FOLLOWING SETTINGS CAN
	# BE CHANGED TO DIFFERENT
	# VALUES WITHIN THE SPECIFIED
	# RANGE OF ACCEPTABLE NUMBERS:

	# Diffuse Size (0 to 3.14)
	m.setDiffuseSize(1.5)

	# Diffuse Smooth (0 to 1.0)
	m.setDiffuseSmooth(.5)

	# Reflect Amount (0 to 1.0)
	# - optionally here to help you
	# with any necessary batch changes
	# to all material reflection values
	# Remove "#" from line below to use:
	# m.setRef(.75)

	# Specular (0 to 2.0)
	m.setSpec(.3)

	# Specular Smooth (0 to 1.0)
	m.setSpecSmooth(.5)

	# Specular Size (0 to 3.14)
	m.setSpecSize(.4)

	# Enable toon edge: 0 = off, 1 = on
	context.enableToonShading(1)

	# Edge Intension (0 to 255)
	context.edgeIntensity(30)


print "PROGRESS: CONVERSION FINISHED!\nTWEAK MATERIALS AND LIGHTING AS NECESSARY."

Blender.Redraw()
