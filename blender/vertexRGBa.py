import bpy
from bpy.types import Panel
from rna_prop_ui import PropertyPanel

bl_info = {
 "name": "Vertex RGBA",
 "author": "Andrew Amundrud (Zenchuck,Tamarin,Blender2Dota)",
 "version": (1, 0),
 "blender": (2, 7, 0),
 "location": "View3D > Tool Bar Properties",
 "description": "Vertex paint panel",
 "warning": "",
 "wiki_url": "",
 "tracker_url": "",
 "category": "Paint"}

""" This set of paint tools is meant to work with a custom fbx export script and was designed primarily with Unity 3D in mind.
The normal vertex color property has 3 elements. The method of adding a 4th variable for alpha values is by adding a second
vertex color layer to the object with a _ALPHA name ending which is read by the exporter. The AO feature is a pre-existing
Blender script called vertex_color_dirt()."""
#"http://forum.unity3d.com/threads/vertex-rgba-blender-2-5x.254038/"

class VertexPainter(bpy.types.Panel):

    bl_label = "Vertex RGBA Paint Tools"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'TOOL_PROPS'

    bpy.types.Scene.strength = bpy.props.FloatProperty(
        name = "Strength", # as you want it to appear on the slider
        default = 1, # optional
        min = 0,
        max = 1,
        description = "Short description of your prop, to show in the popup"
        )

    bpy.types.Scene.iterations = bpy.props.IntProperty(
        name = "Blur Iterations", # as you want it to appear on the slider
        default = 1, # optional
        min = 0,
        max = 40,
        description = "Short description of your prop, to show in the popup"
        )

    bpy.types.Scene.cleanAngle = bpy.props.FloatProperty(
        name = "Clean", # as you want it to appear on the slider
        default = 1, # optional
        min = 0,
        max = 3.14159,
        description = "Short description of your prop, to show in the popup"
        )
    bpy.types.Scene.dirtAngle = bpy.props.FloatProperty(
        name = "Strength", # as you want it to appear on the slider
        default = 1, # optional
        min = 0,
        max = 1.57,
        description = "Short description of your prop, to show in the popup"
        )

    bpy.types.Scene.dirtSwitch = bpy.props.BoolProperty(name = "Dirt Switch", # as you want it to appear on the slider
        description = "Short description of your prop, to show in the popup",
        default = False # optional
        )

    def draw(self,context):

        layout = self.layout
        #ob = context.object

        brush = bpy.data.brushes["Draw"]

        box = layout.box()

        box.label("Brush Color", icon='RIGHTARROW_THIN')
        col = box.column(align=True)
        #col.template_color_picker(brush, "color", value_slider=True)
        col.prop(brush, "color", text = "")

        row = col.row(align=True)

        row.operator("color.set", text = "red").color =(1,0,0)
        row.operator("color.set", text = "yellow").color =(1,1,0)
        row.operator("color.set", text = "green").color =(0,1,0)
        row = col.row(align=True)
        row.operator("color.set", text = "cyan").color =(0,1,1)
        row.operator("color.set", text = "blue").color =(0,0,1)
        row.operator("color.set", text = "magenta").color =(1,0,1)
        row = col.row(align=True)
        row.operator("color.set", text = "white").color =(1,1,1)
        row.operator("color.set", text = "black").color =(0,0,0)

        col = box.column()
        row = col.row()
        row.operator("fill.set", text="Fill with Color")

        box.label("Brush Strength", icon='RIGHTARROW_THIN')

        col = box.column()
        row = col.row(align=True)
        row.operator("strength.set", text="25%").strength =(.25)
        row.operator("strength.set", text="50%").strength =(.5)
        row.operator("strength.set", text="75%").strength =(.75)
        row.operator("strength.set", text="100%").strength =(1)

        box.label("Set Active Layer", icon='RIGHTARROW_THIN')

        col = box.column()
        row = col.row(align=True)
        row.operator("rgblayer.set", text="Paint on RGB").index = (0);
        row.operator("alphalayer.set", text="Paint on Alpha")

        box.label("Bake vertex AO", icon='RIGHTARROW_THIN')

        col = box.column(align=True)
        row = col.row(align=True)
        row.operator("ao.set", text="Bake AO")
        row = col.row(align=True)
        row.operator("reset.set", text="Reset")
        row.prop(context.scene, "dirtAngle")



#    Set color operator
class setBrushColor(bpy.types.Operator):
    bl_idname = "color.set"
    bl_label = "Set brush color"
    color = bpy.props.FloatVectorProperty()

    def invoke(self, context, event):
        bpy.data.brushes["Draw"].color = self.color
        return{'FINISHED'}

#    Set brush strength operator
class setBrushStrength(bpy.types.Operator):
    bl_idname = "strength.set"
    bl_label = "Set brush strength"
    strength = bpy.props.FloatProperty()

    def invoke(self, context, event):
        bpy.context.scene.tool_settings.vertex_paint.use_spray = False
        bpy.data.brushes["Draw"].strength = self.strength
        return{'FINISHED'}

#    Select paint on RGB operator
class setRGBLayer(bpy.types.Operator):
    bl_idname = "rgblayer.set"
    bl_label = "Set RGB layer active"
    index = bpy.props.FloatProperty()

    def invoke(self, context, event):

        bpy.context.active_object.data.vertex_colors.active_index = 0

        return{'FINISHED'}

#    Select paint on Alpha operator
class setAlphaLayer(bpy.types.Operator):
    bl_idname = "alphalayer.set"
    bl_label = "Set Alpha layer active"

    def invoke(self, context, event):
        if len(bpy.context.active_object.data.vertex_colors) > 1:
            bpy.context.active_object.data.vertex_colors.active_index = 1
        else:
            bpy.ops.mesh.vertex_color_add()
            bpy.context.active_object.data.vertex_colors[1].name = "Col_ALPHA"
            bpy.context.active_object.data.vertex_colors.active_index = 1


        return{'FINISHED'}

#    bake AO operator
class bakeAO(bpy.types.Operator):
    bl_idname = "ao.set"
    bl_label = "Bake vertex AO"

    def invoke(self, context, event):

        bpy.ops.paint.vertex_color_dirt(
        blur_strength=.001,
        blur_iterations=2,
        clean_angle=0,
        dirt_angle=bpy.context.scene.dirtAngle,
        dirt_only=True)

        return{'FINISHED'}

#    reset vertex to white
class aoReset(bpy.types.Operator):

    bl_idname = "reset.set"
    bl_label = "Rest vertex to white"
    currentColor = bpy.props.FloatVectorProperty()
    white = bpy.props.FloatVectorProperty()

    def invoke(self, context, event):

        self.currentColor = bpy.data.brushes["Draw"].color
        self.white = (1,1,1)

        bpy.data.brushes["Draw"].color = self.white
        if bpy.ops.paint.vertex_color_set.poll():
            bpy.ops.paint.vertex_color_set()
        bpy.data.brushes["Draw"].color = self.currentColor

        return{'FINISHED'}

#    fill color operator
class fill(bpy.types.Operator):
    bl_idname = "fill.set"
    bl_label = "Fill With Color"

    def invoke(self, context, event):

        if bpy.ops.paint.vertex_color_set.poll():
            bpy.ops.paint.vertex_color_set()

        return{'FINISHED'}


#--- ### Register
def register():
    bpy.utils.register_class(VertexPainter)
    bpy.utils.register_class(setBrushColor)
    bpy.utils.register_class(setBrushStrength)
    bpy.utils.register_class(setRGBLayer)
    bpy.utils.register_class(setAlphaLayer)
    bpy.utils.register_class(bakeAO)
    bpy.utils.register_class(aoReset)
    bpy.utils.register_class(fill)

def unregister():
    bpy.utils.unregister_class(VertexPainter)
    bpy.utils.unregister_class(setBrushColor)
    bpy.utils.unregister_class(setBrushStrength)
    bpy.utils.unregister_class(setRGBLayer)
    bpy.utils.unregister_class(setAlphaLayer)
    bpy.utils.unregister_class(bakeAO)
    bpy.utils.unregister_class(aoReset)
    bpy.utils.unregister_class(fill)

if __name__ == "__main__":
    register()
