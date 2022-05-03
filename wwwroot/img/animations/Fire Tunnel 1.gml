#define scr_particle
//Below is particle code:


particle1 = part_type_create();
part_type_sprite(particle1,Absorb,0,0,0);
part_type_size(particle1,0.10,0.37,0.15,0);
part_type_scale(particle1,1.12,2.35);
part_type_color2(particle1,16777215,0);
part_type_alpha3(particle1,0.57,0.56,0.01);
part_type_speed(particle1,3.75,10.30,-0.23,1);
part_type_direction(particle1,117,323,0,8);
part_type_gravity(particle1,0,270);
part_type_orientation(particle1,37,221,0.40,1,1);
part_type_blend(particle1,1);
part_type_life(particle1,63,84);

emitter1 = part_emitter_create(Sname);
part_emitter_region(Sname,emitter1,x,x,y,y,0,0);
part_emitter_stream(Sname,emitter1,particle1,5);