We need to redesign our Travel Package Management System architecture.

## Current Problem

The current implementation manages package information directly inside day-by-day itinerary items. This creates several issues:

1. Accommodation must be duplicated across multiple days when guests stay in the same hotel.
2. Transportation is difficult to manage because transfers can happen between airports, hotels, activities, ports, and other locations.
3. Pricing becomes difficult to maintain because itinerary items contain product information and pricing information simultaneously.
4. The system should support building travel packages from existing travel products using a single package builder workflow.

## New Architecture Goal

The package should become a collection of travel products connected through an itinerary.

The itinerary should act as the presentation and arrangement layer only.

Pricing should be generated automatically from linked products.

---

# Core Structure

Package
├── Accommodations
├── Activities
├── Transportation
├── VISA
└── Itinerary

The itinerary references products but does not own the product data.

---

# Accommodation Module

Remove Check-In Date and Check-Out Date fields.

Replace them with:

* Accommodation Product
* Room Type
* Start Day
* End Day
* Quantity
* Supplier Cost
* Selling Price

Example:

Accommodation:
Courtyard Seminyak

Start Day:
1

End Day:
3

The system automatically calculates total nights.

One accommodation record should be able to cover multiple itinerary days without duplication.

Example:

Hotel A
Day 1 → Day 3

Hotel B
Day 4 → Day 6

---

# Activity Module

Activities remain independent products.

Fields:

* Activity Product
* Day Number
* Quantity
* Supplier Cost
* Selling Price

Example:

Day 2
Ubud Tour

Day 3
ATV Adventure

---

# Transportation Module

Transportation should become a route-based product.

Fields:

* Day Number
* From Location
* To Location
* Transportation Product
* Quantity
* Supplier Cost
* Selling Price

Examples:

Airport → Hotel

Hotel → Activity

Activity → Hotel

Hotel A → Hotel B

Hotel → Ferry Terminal

This structure must support all transfer scenarios.

---

# VISA Module

Fields:

* VISA Product
* Quantity
* Supplier Cost
* Selling Price

VISA is package-level and not tied to a specific itinerary day unless required.

---

# Itinerary Module

The itinerary should only contain:

* Day Number
* Title
* Description

Each day references related products.

Example:

Day 1

Title:
Arrival In Bali

Description:
Arrival at Bali Airport and transfer to hotel.

References:

* Transportation: Airport → Hotel
* Accommodation: Courtyard Seminyak

---

Day 2

Title:
Ubud Exploration

Description:
Explore Ubud and surrounding attractions.

References:

* Accommodation: Courtyard Seminyak
* Activity: Ubud Tour
* Transportation: Hotel → Ubud Tour
* Transportation: Ubud Tour → Hotel

---

Day 4

Title:
Move To Ayana Resort

Description:
Check out from Seminyak and continue stay in Jimbaran.

References:

* Transportation: Hotel A → Hotel B
* Accommodation: Ayana Resort

The itinerary should never duplicate product information.

It should only reference existing products and relationships.

---

# Pricing Engine

Package pricing must be generated automatically.

Formula:

Package Total Cost =
Accommodation Costs

* Activity Costs
* Transportation Costs
* VISA Costs

Package Selling Price =
Total Cost + Markup

The itinerary itself should not contain pricing information.

---

# Admin Workflow

Step 1

Create Package

Example:

10 Days / 9 Nights Bali Hotel & Tour Combo

---

Step 2

Define Package Duration

10 Days
9 Nights

---

Step 3

Add Accommodation Records

Example:

* Courtyard Seminyak (Day 1–3)
* Ayana Resort (Day 4–6)

---

Step 4

Add Activities

Example:

* Ubud Tour (Day 2)
* ATV Adventure (Day 3)

---

Step 5

Add Transportation

Example:

* Airport → Courtyard Seminyak
* Courtyard Seminyak → Ubud Tour
* Ubud Tour → Courtyard Seminyak
* Courtyard Seminyak → Ayana Resort

---

Step 6

Add VISA Products

---

Step 7

Build Itinerary

Create day-by-day content and link existing products.

---

Step 8

Review Pricing

System automatically calculates package cost and selling price.

---

Step 9

Publish Package

---

# Frontend Requirements

Frontend should consume a single Package endpoint.

The endpoint should return:

* Package Information
* Package Duration
* Pricing Summary
* Accommodation Summary
* Activity Summary
* Transportation Summary
* VISA Summary
* Day-by-Day Itinerary

The frontend itinerary should automatically display linked products for each day.

---

# Expected Outcome

The system should allow travel consultants to create a package such as:

10 Days / 9 Nights Bali Hotel & Tour Combo

using Accommodation, Activities, Transportation, and VISA products from a centralized package builder while avoiding duplicated accommodation records, supporting complex transportation routes, and generating package pricing automatically from linked products.

Update the Travel Package Builder so the final package result is generated from the itinerary structure.

## Main Requirement

The final package output should be an itinerary-based package result.

Each itinerary day must show:

* Day number
* Day title
* Day description
* Connected accommodation/hotel for that day
* Linked activities for that day
* Linked transportation for that day
* Linked VISA product if applicable

The system should connect hotel stays based on Start Day and End Day.

Example:

Accommodation:
Courtyard Seminyak
Start Day: 1
End Day: 3

This hotel should automatically appear in:

* Day 1
* Day 2
* Day 3

Do not duplicate accommodation records manually inside each day.

## Core Data Structure

Package
├── Accommodations
├── Activities
├── Transportation
├── VISA
└── Itinerary Days

## Final Output Format

Each itinerary day should return linked products.

Example:

Day 1:

* Title: Arrival in Bali
* Description: Arrival and transfer to hotel
* Hotel: Courtyard Seminyak
* Activity: None
* Transportation: Airport → Courtyard Seminyak
* VISA: Bali Visa

Day 2:

* Title: Ubud Tour
* Description: Full day Ubud sightseeing
* Hotel: Courtyard Seminyak
* Activity: Ubud Tour
* Transportation:

  * Courtyard Seminyak → Ubud Tour
  * Ubud Tour → Courtyard Seminyak
* VISA: Bali Visa

Day 4:

* Title: Transfer to Jimbaran
* Description: Move from Seminyak to Jimbaran
* Hotel: Ayana Resort
* Activity: None
* Transportation: Courtyard Seminyak → Ayana Resort
* VISA: Bali Visa

## Logic Rules

Accommodation linking:

* If itinerary day number is between accommodation Start Day and End Day, attach that accommodation to the day.
* Example: Start Day 1, End Day 3 means hotel appears on Day 1, Day 2, and Day 3.

Activity linking:

* Activity should appear only on its assigned day.

Transportation linking:

* Transportation should appear only on its assigned day.
* Transportation supports airport to hotel, hotel to activity, activity to hotel, hotel to hotel, hotel to port, and other route-based transfers.

VISA linking:

* VISA can be package-level.
* If VISA is package-level, it can be included in package summary.
* It does not need to appear repeatedly inside every day unless the frontend requires it.

## Pricing Logic

Pricing should be calculated from linked package products:

Total Package Cost =
Accommodation Cost

* Activity Cost
* Transportation Cost
* VISA Cost

The itinerary should not store pricing manually.

## API Requirement

Create or update the package detail API so frontend can consume one clean response:

* Package info
* Duration
* Pricing summary
* Itinerary days with linked accommodation, activity, transportation
* VISA summary

The frontend should not manually calculate which hotel belongs to which day. The backend should return already-connected itinerary data.

## Expected Result

Admin creates products once:

* Accommodation with Start Day and End Day
* Activity with Day Number
* Transportation with Day Number
* VISA as package-level product

Then the system automatically generates itinerary output where each day already contains the correct hotel and linked products.
