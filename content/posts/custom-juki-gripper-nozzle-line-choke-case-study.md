---
title: "When a Standard JUKI Nozzle Isn't Enough: A Custom Gripper for a Line Choke"
slug: custom-juki-gripper-nozzle-line-choke-case-study
locale: en-GB
translation_key: custom-juki-gripper-nozzle-line-choke-case-study
date: 2026-09-11
updated: 2026-09-11
description: A practical case study of a custom JUKI-compatible pneumatic gripper nozzle designed to handle an irregular line choke component, from component analysis to pickup testing.
category: SMT/THT Automation
tags:
  - JUKI
  - Custom Nozzle
  - Gripper Nozzle
  - SMT
  - Odd Form Component
  - Line Choke
  - SMT Automation
  - Component Handling
  - Southern Machinery
cover: /uploads/2026/09/juki-gripper-line-choke.png
cover_width: 2048
cover_height: 1536
gallery:
  - /uploads/2026/09/line-choke-power-supply-board.png
  - /uploads/2026/09/line-choke-component-views.png
  - /uploads/2026/09/juki-gripper-line-choke.png
  - /uploads/2026/09/custom-gripper-nozzle-close-up.png
  - /uploads/2026/09/gripper-line-choke-dimensions.png
  - /uploads/2026/09/juki-gripper-bench-pickup-test.png
author: Light
youtube:
seo_title: "Custom JUKI Gripper Nozzle for Line Choke Handling | SMT Case Study"
seo_description: A practical case study of a custom JUKI-compatible pneumatic gripper nozzle designed to handle an irregular line choke component, from component analysis to pickup testing.
show_image_captions: false
pinned: false
show: true
copy_content: false
show_latest_update: false
---

Sometimes the part causing trouble on an SMT line is not large, expensive, or especially complicated.

It can simply be a component that is awkward to pick up.

This was the situation with a line choke used on a power supply board. The component itself is not unusual, but its shape makes automatic handling less straightforward than a normal chip component.

It has exposed leads, copper windings, uneven surfaces, and very little flat area for a conventional vacuum nozzle.

![Power supply board with line choke component](/uploads/2026/09/line-choke-power-supply-board.png)

So instead of starting with the question, “Which nozzle should we use?”, the better question was:

**How can this component actually be picked up safely and repeatably?**

## Understanding the Component Geometry

The first thing we looked at was the component from different angles.

A top view alone does not tell you enough.

From the bottom and side views, you can see the lead positions, winding height, structural gaps, and the areas that could potentially be used for gripping.

![Line choke component views showing windings and leads](/uploads/2026/09/line-choke-component-views.png)

That matters because a vacuum nozzle needs a reasonably flat and sealed contact surface.

For this line choke, that was not ideal.

The component geometry pointed us toward a different approach: mechanical gripping instead of vacuum pickup.

## Why a Custom Gripper Made More Sense

A standard vacuum nozzle works very well when the component gives you a clean contact surface.

But when the surface is irregular, narrow, or interrupted by windings and gaps, vacuum pickup becomes less reliable.

A gripper works differently.

Instead of relying on an air seal, it holds the component mechanically from selected sides.

For this JUKI application, we used a custom pneumatic gripper nozzle with opposing jaws.

![Custom JUKI-compatible gripper holding a line choke](/uploads/2026/09/juki-gripper-line-choke.png)

The goal was not simply to make something that could “grab” the component.

It also had to match two sides of the application:

- the component itself
- the JUKI machine interface

That means dimensions, jaw position, opening range, component center, installation height, clearance, orientation and actuation all have to work together.

## Checking the Tool Against the Actual Part

One small but important step was simply putting the tool and the actual component together and checking the physical relationship.

The jaws need enough opening clearance to approach the component without touching the leads.

At the same time, the closing stroke needs to be controlled well enough to hold the component without applying unnecessary force.

![Custom gripper nozzle close-up](/uploads/2026/09/custom-gripper-nozzle-close-up.png)

This is why actual samples are so useful.

A drawing gives dimensions, but a real part often shows details that are easy to miss on paper.

![Gripper and line choke shown with a measurement reference](/uploads/2026/09/gripper-line-choke-dimensions.png)

## Bench Pickup Test

Before talking about full production performance, we first checked the basic mechanical idea.

The test was simple:

**approach → grip → lift → hold → release**

![Bench pickup test sequence for the line choke](/uploads/2026/09/juki-gripper-bench-pickup-test.png)

The gripper was able to pick up and hold the line choke under the demonstrated test conditions.

Bench pickup test only proves the basic mechanical concept. It does not by itself prove full production performance.

That is a useful first result, but it is important not to overstate it.

A successful bench test does not automatically mean that the tooling is fully validated for continuous production.

The next step should always be machine-side testing.

Once the gripper is installed on the actual JUKI machine, I would pay attention to several things:

- Is pickup repeatable over many cycles?
- Does the component enter the jaws consistently?
- Is the component stable during XY movement and rotation?
- Can the vision system recognize the component correctly?
- Is placement position accurate?
- Does the component release cleanly?
- Is there enough clearance around feeders and nearby hardware?
- Do the jaws and springs remain stable after repeated use?

These details are what separate a working prototype from a production-ready solution.

## The Same Pattern Applies to Other Odd-Form Components

The same type of issue appears with many odd-shaped components:

- coils
- transformers
- relays
- connectors
- sensors
- shielding parts
- camera modules
- terminals

Sometimes the answer is a custom vacuum tip.

Sometimes it is a soft-contact nozzle.

Sometimes it is a multi-hole design.

And sometimes, like in this case, a mechanical gripper makes more sense.

There is no single “best nozzle” for every application.

The component geometry and production process should decide the solution.

## Information Needed for a Similar JUKI Application

For a similar JUKI application, the most useful information would be:

1. Clear photos from the top, bottom and sides
2. A dimensional drawing or physical sample
3. Component length, width, height and weight
4. JUKI machine model and placement-head information
5. Existing nozzle or machine-interface photos
6. A short video showing the current pickup problem
7. Expected production conditions and cycle requirements

In many cases, a few good photos and a sample already tell us much more than a long email description.

## Final Takeaway

This is a good example of why I do not think automation problems should always start with the machine.

Sometimes the machine is fine.

The real bottleneck is one component, one feeder, one nozzle, one fixture or one small process that is still unstable.

Solving that small point can sometimes be more useful than replacing a much larger piece of equipment.

For me, that is also the interesting part of SMT/THT automation:

understanding the actual production problem first, and then deciding what kind of tooling or equipment really makes sense.

If you are dealing with a component that is difficult to pick, feed or insert, sending a few photos of the part is often the easiest place to start.

## Common Questions

### Is this an OEM JUKI product?

No. This is a customized compatible gripper solution for a JUKI application. It should not be described as an OEM JUKI product unless the origin is specifically verified.

### Can this gripper handle other components?

Possibly, but it depends on the dimensions and available gripping areas. Different components may require changes to the jaw geometry or opening range.

### Does the bench test prove production readiness?

No. It confirms the basic mechanical concept. Final validation should still be done on the intended machine under actual production conditions.
