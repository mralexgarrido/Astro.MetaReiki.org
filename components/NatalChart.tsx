import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ChartData, ZODIAC_SIGNS, PlanetPosition } from '../types';

interface Props {
  data: ChartData;
}

export const NatalChart: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const width = 600;
    const height = 600;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.7; // Start of houses/planets area
    const zodiacRadius = radius * 0.85; // Text radius for signs

    const g = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Whole Sign Setup:
    // We want the Ascendant Sign's 0 degree (which is the House 1 Cusp) to be at 180 degrees (Left, 9 o'clock).
    // The data.zodiacOffset gives us the start of the Ascendant Sign in ecliptic longitude.
    // e.g., if Asc Sign is Taurus (starts at 30 deg), offset is 30.
    // D3 0 degrees is usually 12 o'clock or 3 o'clock depending on arc implementation.
    // d3.arc 0 is at 12 o'clock, clockwise.
    // We want House 1 (Asc Sign) to range from 9 o'clock to 8 o'clock (CCW? No, zodiac goes CCW).
    // Traditionally: 1st House is below horizon on left? No, 1st house is just below Ascendant usually, but in Whole Sign, Ascendant Sign is House 1.
    // Let's standard: Ascendant (Left, 9 o'clock) is the start of House 1. Signs proceed Counter-Clockwise (standard Astrology).
    // So House 1 is [180 deg, 150 deg] in cartesian? Or [180, 210]?
    // Standard chart: Aries starts 0 deg (3 o'clock? No, usually Vernal Equinox is placed based on Asc).
    // We rotate the whole wheel so that the Ascendant Sign Start is at 180 degrees (Left).
    
    // Rotation Angle:
    // If Asc Sign starts at L degrees.
    // We want L to be at angle PI/2 (90 deg, which is 6 o'clock? No).
    // D3 arc: 0 is 12 o'clock. 
    // -90 is 9 o'clock.
    // We want L to map to -90 deg.
    // Current Rotation = -90 - L.
    
    // Wait, D3 arc angles are in radians. 0 is up. PI/2 is right. PI is down. -PI/2 is left.
    // We want the start of Asc Sign (L) to be at -PI/2.
    // So we rotate everything by (-PI/2 - degToRad(L)).
    
    const ascSignStart = data.zodiacOffset; // 0, 30, 60 etc.
    const rotationOffset = -90 - ascSignStart; 
    
    const degToRad = (d: number) => d * (Math.PI / 180);
    
    // Draw Zodiac Ring
    const pie = d3.pie<any>().value(1).sort(null); // 12 equal slices
    // We generate dummy data for 12 signs, but we need to rotate the group to align signs correctly
    // Actually, simpler: draw arcs for each sign based on their longitude
    
    const signsG = g.append("g")
      .attr("transform", `rotate(${rotationOffset})`);

    const arc = d3.arc<any>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .startAngle(d => degToRad(d.start))
      .endAngle(d => degToRad(d.end));

    ZODIAC_SIGNS.forEach(sign => {
      const start = sign.id * 30;
      const end = start + 30;
      
      const path = signsG.append("path")
        .datum({ start, end })
        .attr("d", arc)
        .attr("fill", "none")
        .attr("stroke", "#334155")
        .attr("stroke-width", 1);

      // Label position
      const centroid = arc.centroid({ start, end } as any);
      signsG.append("text")
        .attr("transform", `translate(${centroid}) rotate(${-rotationOffset})`) // Counter-rotate text
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(sign.symbol)
        .attr("class", "text-2xl font-serif fill-slate-200")
        .style("font-size", "24px");
        
      // House numbers (Whole Sign)
      // The house number is fixed relative to the view, not the zodiac.
      // But here we are rotating the zodiac.
      // Let's place House numbers on the fixed frame.
    });
    
    // Draw House Lines (Cusps)
    // In fixed frame, House 1 starts at 9 o'clock (270 deg / -90 deg).
    // We can draw lines radiating from inner radius.
    const housesG = g.append("g");
    for(let i=0; i<12; i++) {
        const angle = -90 + (i * 30); // 9 o'clock, 8 o'clock... wait. Houses go CCW (1, 2, 3...)
        // House 1: -90 to -60 ? No.
        // Zodiac moves CCW. Houses are static 1-12 CCW.
        // Cusp 1 is at -90 (Asc). Cusp 2 is at -90 + 30 = -60? No, that's moving towards bottom (6 oclock is 180).
        // -90 is Left. 0 is Top.
        // CCW from Left (-90) -> Bottom (0? No 0 is Top). 
        // D3: 0=Top, 90=Right, 180=Bottom, 270=Left(-90).
        // CCW from Left (270) -> 240? No that is CW.
        // CCW from 270 is 260... 180 ... 
        // Wait, standard angle: 0 is Right (Math).
        // D3 Arc: 0 is Top (Clockwise positive).
        // Let's stick to D3 Arc.
        // 0 (Top).
        // We want House 1 to start at Left (-90 deg or 270 deg) and go DOWN (CCW in astrology chart).
        // Left is 270. Down is 180.
        // So House 1 is 270 -> 240? No.
        // Standard chart: Asc is Left. Desc is Right. MC is Top (usually).
        // House 1 is below Ascendant. (Quadrants 3 in Cartesian?).
        // Actually, in Whole Sign, the Ascendant Sign is the whole 1st house.
        // So the sector from -90 deg (Left) to -120 deg (lower left) is House 1.
        // Wait, -90 (Left) -> -180 (Bottom) is 90 degrees.
        // 1 House = 30 deg.
        // So House 1: -90 to -120. (CCW relative to wheel? No. Zodiac order is CCW).
        // 1 -> 2 -> 3.
        // Aries -> Taurus -> Gemini.
        // If Asc is Aries (Left). Taurus is below it.
        // So yes, House 1 is -90 to -120 (in D3 terms, moving CCW is negative angle? No, D3 arc is CW positive).
        // D3: 0 (Top), 90 (Right), 180 (Bottom), 270 (Left).
        // CCW motion means decreasing angle.
        // So House 1: 270 -> 240. House 2: 240 -> 210.
        // Let's verify.
        
        const startAngle = 270 - (i * 30);
        const endAngle = 270 - ((i+1) * 30);
        
        // Cusp Line
        const rRad = degToRad(startAngle);
        const x1 = Math.sin(rRad) * innerRadius; // D3 Arc logic uses sin/cos swapped usually? 
        // D3 arc: 0 is top. x = sin(a), y = -cos(a).
        const x_start = Math.sin(degToRad(startAngle)) * innerRadius;
        const y_start = -Math.cos(degToRad(startAngle)) * innerRadius;
        const x_end = Math.sin(degToRad(startAngle)) * radius;
        const y_end = -Math.cos(degToRad(startAngle)) * radius;
        
        housesG.append("line")
            .attr("x1", x_start).attr("y1", y_start)
            .attr("x2", x_end).attr("y2", y_end)
            .attr("stroke", "rgba(255,255,255,0.1)")
            .attr("stroke-width", 1);
            
        // House Number
        const midAngle = 270 - (i * 30) - 15;
        const x_num = Math.sin(degToRad(midAngle)) * (innerRadius * 0.9);
        const y_num = -Math.cos(degToRad(midAngle)) * (innerRadius * 0.9);
        
        housesG.append("text")
            .attr("x", x_num)
            .attr("y", y_num)
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .text(i+1)
            .attr("class", "text-xs fill-slate-500 font-sans");
    }

    // Planets
    // We place planets based on their longitude.
    // We already have the 'signs' ring rotated by `rotationOffset`.
    // We can place planets in that same coordinate system (rotated).
    
    // Sort planets by longitude to handle overlapping? 
    // Basic collision detection is hard in simple D3 script. 
    // We'll just stack them radially if needed or just let them overlap for MVP.
    
    const planetsG = g.append("g")
       .attr("transform", `rotate(${rotationOffset})`);

    // Helper to separate close planets (simple radial shift)
    const sortedPlanets = [...data.planets].sort((a,b) => a.longitude - b.longitude);
    const renderedPositions: {long: number, radius: number}[] = [];

    data.planets.forEach(planet => {
      // Check for overlap
      let planetRadius = innerRadius * 0.75;
      let collision = true;
      let attempt = 0;
      
      // Very naive collision adjustment: push inwards if close to another
      while(collision && attempt < 3) {
          collision = false;
          for(let p of renderedPositions) {
              if (Math.abs(p.long - planet.longitude) < 5 && Math.abs(p.radius - planetRadius) < 15) {
                  collision = true;
                  planetRadius -= 20;
                  break;
              }
          }
          attempt++;
      }
      renderedPositions.push({long: planet.longitude, radius: planetRadius});

      const angle = degToRad(planet.longitude);
      const x = Math.sin(angle) * planetRadius;
      const y = -Math.cos(angle) * planetRadius;

      // Line from sign to planet
      planetsG.append("line")
        .attr("x1", Math.sin(angle) * innerRadius)
        .attr("y1", -Math.cos(angle) * innerRadius)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "rgba(255,255,255,0.2)");

      // Planet Glyph
      const pGroup = planetsG.append("g")
        .attr("transform", `translate(${x}, ${y})`);
        
      pGroup.append("circle")
        .attr("r", 12)
        .attr("fill", "#0f172a")
        .attr("stroke", "#d4af37")
        .attr("stroke-width", 1);
        
      pGroup.append("text")
        .text(planet.symbol)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("transform", `rotate(${-rotationOffset})`) // Keep text upright
        .attr("class", "text-sm fill-amber-400 font-serif");
    });
    
    // ASC and MC Markers
    // ASC is always at House 1 Cusp (270 deg in view).
    // In the rotated group, ASC longitude matches 270 deg view.
    
    // Let's add specific markers for ASC/MC on the outer ring?
    // They are planets in the list, so they are drawn.
    // But typically ASC has a big line.
    
  }, [data]);

  return (
    <div className="flex justify-center items-center py-8">
      <svg ref={svgRef} className="w-full h-auto max-w-[600px] drop-shadow-2xl overflow-visible"></svg>
    </div>
  );
};