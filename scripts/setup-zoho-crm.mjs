#!/usr/bin/env node
/**
 * ROVER — Zoho CRM Setup Script
 * ─────────────────────────────────────────────────────────────────────────────
 * Creates all modules, fields, and workflows required for the ROVER platform.
 *
 * Usage:
 *   node scripts/setup-zoho-crm.mjs <access_token>
 *
 * How to get the access token:
 *   1. Log in to ROVER with Zoho CRM (localhost:3013/login)
 *   2. After redirect to /studio, open DevTools → Application → Local Storage
 *   3. Copy the value of rover_auth_token
 *
 * Required OAuth scopes (update login page before running):
 *   ZohoCRM.modules.ALL ZohoCRM.settings.ALL ZohoCRM.users.READ
 *
 * Zoho CRM India DC:
 *   API base: https://www.zohoapis.in/crm/v2
 */

const ACCESS_TOKEN = process.argv[2];
const DC = "in"; // India data center

if (!ACCESS_TOKEN) {
  console.error("❌  Usage: node scripts/setup-zoho-crm.mjs <access_token>");
  console.error("    Get the token from DevTools → Application → Local Storage → rover_auth_token");
  process.exit(1);
}

const BASE = `https://www.zohoapis.${DC}/crm/v2`;

const headers = {
  Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
  "Content-Type": "application/json",
};

// ─── helpers ──────────────────────────────────────────────────────────────────

async function api(method, path, body) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  return { status: res.status, ok: res.ok, data };
}

function ok(label, result) {
  if (result.ok || result.status === 201 || result.status === 200) {
    console.log(`  ✅  ${label}`);
    return true;
  }
  console.warn(`  ⚠️   ${label} — HTTP ${result.status}:`, JSON.stringify(result.data).slice(0, 200));
  return false;
}

// ─── 1. CUSTOM MODULE: Experiences ──────────────────────────────────────────

async function createExperiencesModule() {
  console.log("\n📦  Creating module: Experiences");

  const result = await api("POST", "/settings/modules", {
    modules: [
      {
        module_name:    "Experiences",
        singular_label: "Experience",
        plural_label:   "Experiences",
        description:    "Travel packages and curated experiences offered by ROVER agencies",
        api_name:       "Experiences",
        generated_type: "custom",
      },
    ],
  });
  ok("Module: Experiences", result);
  return result;
}

async function createExperienceFields() {
  console.log("\n🔧  Adding fields to: Experiences");

  const fields = [
    { field_label: "Experience Name",  api_name: "Experience_Name",  data_type: "text",       length: 255, mandatory: true },
    { field_label: "Location",          api_name: "Location",          data_type: "text",       length: 255 },
    { field_label: "State",             api_name: "State",             data_type: "text",       length: 100 },
    { field_label: "Country",           api_name: "Country",           data_type: "text",       length: 100, default_value: "India" },
    { field_label: "Duration (Days)",   api_name: "Duration_Days",     data_type: "integer" },
    { field_label: "Price Per Person",  api_name: "Price_Per_Person",  data_type: "currency" },
    { field_label: "Max Capacity",      api_name: "Max_Capacity",      data_type: "integer" },
    { field_label: "Current Bookings",  api_name: "Current_Bookings",  data_type: "integer",    default_value: 0 },
    {
      field_label: "Category",
      api_name:    "Category",
      data_type:   "picklist",
      pick_list_values: [
        { display_value: "Adventure",   actual_value: "Adventure",   sequence_number: 1 },
        { display_value: "Cultural",    actual_value: "Cultural",    sequence_number: 2 },
        { display_value: "Beach",       actual_value: "Beach",       sequence_number: 3 },
        { display_value: "Mountain",    actual_value: "Mountain",    sequence_number: 4 },
        { display_value: "Wildlife",    actual_value: "Wildlife",    sequence_number: 5 },
        { display_value: "Spiritual",   actual_value: "Spiritual",   sequence_number: 6 },
        { display_value: "Road Trip",   actual_value: "Road_Trip",   sequence_number: 7 },
      ],
    },
    {
      field_label: "Difficulty Level",
      api_name:    "Difficulty_Level",
      data_type:   "picklist",
      pick_list_values: [
        { display_value: "Easy",         actual_value: "Easy",         sequence_number: 1 },
        { display_value: "Moderate",     actual_value: "Moderate",     sequence_number: 2 },
        { display_value: "Challenging",  actual_value: "Challenging",  sequence_number: 3 },
        { display_value: "Expert",       actual_value: "Expert",       sequence_number: 4 },
      ],
    },
    {
      field_label: "Status",
      api_name:    "Status",
      data_type:   "picklist",
      pick_list_values: [
        { display_value: "Draft",      actual_value: "Draft",      sequence_number: 1 },
        { display_value: "Published",  actual_value: "Published",  sequence_number: 2 },
        { display_value: "Paused",     actual_value: "Paused",     sequence_number: 3 },
        { display_value: "Archived",   actual_value: "Archived",   sequence_number: 4 },
      ],
      default_value: "Draft",
    },
    { field_label: "Description",       api_name: "Description",       data_type: "textarea",   length: 2000 },
    { field_label: "Highlights",        api_name: "Highlights",        data_type: "textarea",   length: 2000 },
    { field_label: "Inclusions",        api_name: "Inclusions",        data_type: "textarea",   length: 2000 },
    { field_label: "Exclusions",        api_name: "Exclusions",        data_type: "textarea",   length: 2000 },
    { field_label: "Cover Image URL",   api_name: "Cover_Image_URL",   data_type: "text",       length: 500 },
    { field_label: "Rating",            api_name: "Rating",            data_type: "decimal" },
    { field_label: "Review Count",      api_name: "Review_Count",      data_type: "integer",    default_value: 0 },
    { field_label: "ROVER Experience ID", api_name: "ROVER_Experience_ID", data_type: "text",   length: 100 },
    { field_label: "Published Date",    api_name: "Published_Date",    data_type: "date" },
    { field_label: "Next Departure",    api_name: "Next_Departure",    data_type: "date" },
  ];

  for (const field of fields) {
    const result = await api("POST", "/settings/fields?module=Experiences", { fields: [field] });
    ok(`  Field: ${field.field_label}`, result);
  }
}

// ─── 2. CUSTOM MODULE: Bookings ───────────────────────────────────────────────

async function createBookingsModule() {
  console.log("\n📦  Creating module: Bookings");

  const result = await api("POST", "/settings/modules", {
    modules: [
      {
        module_name:    "Bookings",
        singular_label: "Booking",
        plural_label:   "Bookings",
        description:    "Traveler bookings for ROVER experiences",
        api_name:       "Bookings",
        generated_type: "custom",
      },
    ],
  });
  ok("Module: Bookings", result);
}

async function createBookingFields() {
  console.log("\n🔧  Adding fields to: Bookings");

  const fields = [
    { field_label: "Booking Reference",   api_name: "Booking_Reference",   data_type: "text",     length: 50,  mandatory: true },
    { field_label: "Experience Name",     api_name: "Experience_Name",      data_type: "text",     length: 255 },
    { field_label: "Traveler Name",       api_name: "Traveler_Name",        data_type: "text",     length: 255 },
    { field_label: "Traveler Email",      api_name: "Traveler_Email",       data_type: "email" },
    { field_label: "Traveler Phone",      api_name: "Traveler_Phone",       data_type: "phone" },
    { field_label: "Number of Travelers", api_name: "Number_of_Travelers",  data_type: "integer",  mandatory: true },
    { field_label: "Travel Date",         api_name: "Travel_Date",          data_type: "date",     mandatory: true },
    { field_label: "Booking Date",        api_name: "Booking_Date",         data_type: "date" },
    { field_label: "Price Per Person",    api_name: "Price_Per_Person",     data_type: "currency" },
    { field_label: "Total Amount",        api_name: "Total_Amount",         data_type: "currency" },
    { field_label: "Amount Paid",         api_name: "Amount_Paid",          data_type: "currency", default_value: 0 },
    { field_label: "Balance Due",         api_name: "Balance_Due",          data_type: "currency", default_value: 0 },
    {
      field_label: "Booking Status",
      api_name:    "Booking_Status",
      data_type:   "picklist",
      pick_list_values: [
        { display_value: "Pending",    actual_value: "Pending",    sequence_number: 1 },
        { display_value: "Confirmed",  actual_value: "Confirmed",  sequence_number: 2 },
        { display_value: "Completed",  actual_value: "Completed",  sequence_number: 3 },
        { display_value: "Cancelled",  actual_value: "Cancelled",  sequence_number: 4 },
        { display_value: "Refunded",   actual_value: "Refunded",   sequence_number: 5 },
      ],
      default_value: "Pending",
    },
    {
      field_label: "Payment Status",
      api_name:    "Payment_Status",
      data_type:   "picklist",
      pick_list_values: [
        { display_value: "Unpaid",           actual_value: "Unpaid",          sequence_number: 1 },
        { display_value: "Partially Paid",   actual_value: "Partially_Paid",  sequence_number: 2 },
        { display_value: "Fully Paid",       actual_value: "Fully_Paid",      sequence_number: 3 },
        { display_value: "Refunded",         actual_value: "Refunded",        sequence_number: 4 },
      ],
      default_value: "Unpaid",
    },
    {
      field_label: "Payment Method",
      api_name:    "Payment_Method",
      data_type:   "picklist",
      pick_list_values: [
        { display_value: "UPI",          actual_value: "UPI",          sequence_number: 1 },
        { display_value: "Credit Card",  actual_value: "Credit_Card",  sequence_number: 2 },
        { display_value: "Debit Card",   actual_value: "Debit_Card",   sequence_number: 3 },
        { display_value: "Net Banking",  actual_value: "Net_Banking",  sequence_number: 4 },
        { display_value: "Bank Transfer", actual_value: "Bank_Transfer", sequence_number: 5 },
      ],
    },
    { field_label: "Special Requests",    api_name: "Special_Requests",     data_type: "textarea", length: 1000 },
    { field_label: "Emergency Contact",   api_name: "Emergency_Contact",     data_type: "text",     length: 255 },
    { field_label: "Emergency Phone",     api_name: "Emergency_Phone",       data_type: "phone" },
    { field_label: "ROVER Booking ID",    api_name: "ROVER_Booking_ID",      data_type: "text",     length: 100 },
    { field_label: "Agency Name",         api_name: "Agency_Name",           data_type: "text",     length: 255 },
    { field_label: "Cancellation Reason", api_name: "Cancellation_Reason",   data_type: "textarea", length: 500 },
    { field_label: "Review Rating",       api_name: "Review_Rating",         data_type: "integer" },
    { field_label: "Review Text",         api_name: "Review_Text",           data_type: "textarea", length: 1000 },
  ];

  for (const field of fields) {
    const result = await api("POST", "/settings/fields?module=Bookings", { fields: [field] });
    ok(`  Field: ${field.field_label}`, result);
  }
}

// ─── 3. CUSTOM FIELDS on Contacts (Travelers) ────────────────────────────────

async function addContactFields() {
  console.log("\n🔧  Adding fields to: Contacts (Travelers)");

  const fields = [
    { field_label: "ROVER User ID",       api_name: "ROVER_User_ID",        data_type: "text",     length: 100 },
    { field_label: "Date of Birth",       api_name: "Date_of_Birth",         data_type: "date" },
    { field_label: "Nationality",         api_name: "Nationality",           data_type: "text",     length: 100 },
    { field_label: "Passport Number",     api_name: "Passport_Number",       data_type: "text",     length: 50 },
    { field_label: "Passport Expiry",     api_name: "Passport_Expiry",       data_type: "date" },
    { field_label: "Emergency Contact Name",  api_name: "Emergency_Contact_Name",  data_type: "text",  length: 255 },
    { field_label: "Emergency Contact Phone", api_name: "Emergency_Contact_Phone", data_type: "phone" },
    { field_label: "Dietary Requirements",    api_name: "Dietary_Requirements",    data_type: "text",  length: 255 },
    { field_label: "Medical Conditions",      api_name: "Medical_Conditions",      data_type: "textarea", length: 500 },
    { field_label: "Profile Completion %",    api_name: "Profile_Completion",      data_type: "integer" },
    { field_label: "Total Trips Booked",      api_name: "Total_Trips_Booked",      data_type: "integer", default_value: 0 },
    { field_label: "Total Spend",             api_name: "Total_Spend",             data_type: "currency", default_value: 0 },
    { field_label: "Last Trip Date",          api_name: "Last_Trip_Date",          data_type: "date" },
    {
      field_label: "Travel Preferences",
      api_name:    "Travel_Preferences",
      data_type:   "multiselectpicklist",
      pick_list_values: [
        { display_value: "Adventure",   actual_value: "Adventure",  sequence_number: 1 },
        { display_value: "Cultural",    actual_value: "Cultural",   sequence_number: 2 },
        { display_value: "Beach",       actual_value: "Beach",      sequence_number: 3 },
        { display_value: "Mountain",    actual_value: "Mountain",   sequence_number: 4 },
        { display_value: "Wildlife",    actual_value: "Wildlife",   sequence_number: 5 },
        { display_value: "Spiritual",   actual_value: "Spiritual",  sequence_number: 6 },
        { display_value: "Luxury",      actual_value: "Luxury",     sequence_number: 7 },
        { display_value: "Budget",      actual_value: "Budget",     sequence_number: 8 },
      ],
    },
    {
      field_label: "Traveler Type",
      api_name:    "Traveler_Type",
      data_type:   "picklist",
      pick_list_values: [
        { display_value: "Solo",    actual_value: "Solo",   sequence_number: 1 },
        { display_value: "Couple",  actual_value: "Couple", sequence_number: 2 },
        { display_value: "Group",   actual_value: "Group",  sequence_number: 3 },
        { display_value: "Family",  actual_value: "Family", sequence_number: 4 },
      ],
    },
    { field_label: "Instagram Handle",   api_name: "Instagram_Handle",   data_type: "text",  length: 100 },
    { field_label: "ROVER Verified",     api_name: "ROVER_Verified",     data_type: "boolean" },
  ];

  for (const field of fields) {
    const result = await api("POST", "/settings/fields?module=Contacts", { fields: [field] });
    ok(`  Field: ${field.field_label}`, result);
  }
}

// ─── 4. CUSTOM FIELDS on Accounts (Agencies/Studios) ─────────────────────────

async function addAccountFields() {
  console.log("\n🔧  Adding fields to: Accounts (Agencies)");

  const fields = [
    { field_label: "ROVER Studio ID",     api_name: "ROVER_Studio_ID",      data_type: "text",     length: 100 },
    { field_label: "License Number",      api_name: "License_Number",        data_type: "text",     length: 100 },
    { field_label: "GST Number",          api_name: "GST_Number",            data_type: "text",     length: 20 },
    { field_label: "Agency Rating",       api_name: "Agency_Rating",         data_type: "decimal" },
    { field_label: "Total Reviews",       api_name: "Total_Reviews",         data_type: "integer",  default_value: 0 },
    { field_label: "Total Experiences",   api_name: "Total_Experiences",     data_type: "integer",  default_value: 0 },
    { field_label: "Total Bookings",      api_name: "Total_Bookings",        data_type: "integer",  default_value: 0 },
    { field_label: "Total Revenue",       api_name: "Total_Revenue",         data_type: "currency", default_value: 0 },
    { field_label: "Monthly Revenue",     api_name: "Monthly_Revenue",       data_type: "currency", default_value: 0 },
    { field_label: "Commission Rate %",   api_name: "Commission_Rate",       data_type: "decimal" },
    { field_label: "ROVER Verified",      api_name: "ROVER_Verified",        data_type: "boolean" },
    { field_label: "Featured Agency",     api_name: "Featured_Agency",       data_type: "boolean" },
    { field_label: "Logo URL",            api_name: "Logo_URL",              data_type: "text",     length: 500 },
    { field_label: "Cover Photo URL",     api_name: "Cover_Photo_URL",       data_type: "text",     length: 500 },
    { field_label: "Tagline",             api_name: "Tagline",               data_type: "text",     length: 255 },
    { field_label: "Instagram Handle",    api_name: "Instagram_Handle",      data_type: "text",     length: 100 },
    { field_label: "Bank Account Name",   api_name: "Bank_Account_Name",     data_type: "text",     length: 255 },
    { field_label: "Bank Account Number", api_name: "Bank_Account_Number",   data_type: "text",     length: 50 },
    { field_label: "IFSC Code",           api_name: "IFSC_Code",             data_type: "text",     length: 20 },
    { field_label: "Onboarded Date",      api_name: "Onboarded_Date",        data_type: "date" },
    {
      field_label: "Agency Status",
      api_name:    "Agency_Status",
      data_type:   "picklist",
      pick_list_values: [
        { display_value: "Active",     actual_value: "Active",     sequence_number: 1 },
        { display_value: "Pending",    actual_value: "Pending",    sequence_number: 2 },
        { display_value: "Suspended",  actual_value: "Suspended",  sequence_number: 3 },
        { display_value: "Inactive",   actual_value: "Inactive",   sequence_number: 4 },
      ],
      default_value: "Pending",
    },
    {
      field_label: "Specializations",
      api_name:    "Specializations",
      data_type:   "multiselectpicklist",
      pick_list_values: [
        { display_value: "Adventure",   actual_value: "Adventure",  sequence_number: 1 },
        { display_value: "Cultural",    actual_value: "Cultural",   sequence_number: 2 },
        { display_value: "Wildlife",    actual_value: "Wildlife",   sequence_number: 3 },
        { display_value: "Beach",       actual_value: "Beach",      sequence_number: 4 },
        { display_value: "Mountain",    actual_value: "Mountain",   sequence_number: 5 },
        { display_value: "Luxury",      actual_value: "Luxury",     sequence_number: 6 },
        { display_value: "Budget",      actual_value: "Budget",     sequence_number: 7 },
        { display_value: "Solo Travel", actual_value: "Solo_Travel", sequence_number: 8 },
      ],
    },
  ];

  for (const field of fields) {
    const result = await api("POST", "/settings/fields?module=Accounts", { fields: [field] });
    ok(`  Field: ${field.field_label}`, result);
  }
}

// ─── 5. WORKFLOWS ─────────────────────────────────────────────────────────────

async function createWorkflows() {
  console.log("\n⚙️   Creating Workflows");

  const workflows = [
    // Workflow 1: Booking Confirmed → Email Traveler
    {
      name:         "ROVER — Booking Confirmed: Email Traveler",
      description:  "Sends a confirmation email to the traveler when a booking is confirmed",
      module:       { api_name: "Bookings" },
      trigger: {
        conditions: [{ field: { api_name: "Booking_Status" }, comparator: "equal", value: "Confirmed" }],
        type: "On a record action",
        actions: ["Edit"],
      },
      actions: [
        {
          type:     "EmailNotification",
          name:     "Booking Confirmation Email",
          subject:  "✅ Your ROVER Booking is Confirmed!",
          content:  "Hi ${Traveler_Name},\n\nYour booking for ${Experience_Name} is confirmed!\n\nBooking Reference: ${Booking_Reference}\nTravel Date: ${Travel_Date}\nNumber of Travelers: ${Number_of_Travelers}\nTotal Amount: ₹${Total_Amount}\n\nSee you on the trail! 🏔️\n\nThe ROVER Team",
          from: { type: "OrgEmailAddress" },
          to:   [{ type: "field", field_name: "Traveler_Email" }],
        },
      ],
      active: true,
    },

    // Workflow 2: Booking Cancelled → Email Traveler
    {
      name:         "ROVER — Booking Cancelled: Notify Traveler",
      description:  "Sends a cancellation email to the traveler when a booking is cancelled",
      module:       { api_name: "Bookings" },
      trigger: {
        conditions: [{ field: { api_name: "Booking_Status" }, comparator: "equal", value: "Cancelled" }],
        type: "On a record action",
        actions: ["Edit"],
      },
      actions: [
        {
          type:     "EmailNotification",
          name:     "Booking Cancellation Email",
          subject:  "Booking Cancellation — ${Booking_Reference}",
          content:  "Hi ${Traveler_Name},\n\nYour booking ${Booking_Reference} for ${Experience_Name} has been cancelled.\n\nReason: ${Cancellation_Reason}\n\nIf you have any questions, please contact your agency.\n\nThe ROVER Team",
          from: { type: "OrgEmailAddress" },
          to:   [{ type: "field", field_name: "Traveler_Email" }],
        },
      ],
      active: true,
    },

    // Workflow 3: Experience Published → Tag as active
    {
      name:         "ROVER — Experience Published: Set Active",
      description:  "Sets Published Date when an experience status changes to Published",
      module:       { api_name: "Experiences" },
      trigger: {
        conditions: [{ field: { api_name: "Status" }, comparator: "equal", value: "Published" }],
        type: "On a record action",
        actions: ["Edit"],
      },
      actions: [
        {
          type:   "FieldUpdate",
          name:   "Set Published Date",
          field:  { api_name: "Published_Date" },
          value:  "${TODAY}",
        },
      ],
      active: true,
    },

    // Workflow 4: New Booking Created → Update Booking Date
    {
      name:         "ROVER — New Booking: Set Booking Date",
      description:  "Automatically sets the Booking Date to today when a new booking is created",
      module:       { api_name: "Bookings" },
      trigger: {
        type: "On a record action",
        actions: ["Create"],
      },
      actions: [
        {
          type:   "FieldUpdate",
          name:   "Set Booking Date to Today",
          field:  { api_name: "Booking_Date" },
          value:  "${TODAY}",
        },
      ],
      active: true,
    },

    // Workflow 5: Booking Completed → Request Review
    {
      name:         "ROVER — Booking Completed: Request Review",
      description:  "Sends a review request email when a booking is marked as Completed",
      module:       { api_name: "Bookings" },
      trigger: {
        conditions: [{ field: { api_name: "Booking_Status" }, comparator: "equal", value: "Completed" }],
        type: "On a record action",
        actions: ["Edit"],
      },
      actions: [
        {
          type:     "EmailNotification",
          name:     "Review Request Email",
          subject:  "How was your ${Experience_Name} experience? ⭐",
          content:  "Hi ${Traveler_Name},\n\nWe hope you had an amazing trip!\n\nWe'd love to hear about your experience on ${Experience_Name}. Your feedback helps other travelers discover great adventures.\n\nClick here to leave your review: https://roverweb-jsvmpbxm.onslate.in/experiences\n\nSafe travels,\nThe ROVER Team 🌏",
          from: { type: "OrgEmailAddress" },
          to:   [{ type: "field", field_name: "Traveler_Email" }],
        },
      ],
      active: true,
    },

    // Workflow 6: High-Value Booking Alert
    {
      name:         "ROVER — High Value Booking: Alert Agency",
      description:  "Flags bookings over ₹1,00,000 for priority handling",
      module:       { api_name: "Bookings" },
      trigger: {
        conditions: [{ field: { api_name: "Total_Amount" }, comparator: "greater_than", value: "100000" }],
        type: "On a record action",
        actions: ["Create", "Edit"],
      },
      actions: [
        {
          type:   "FieldUpdate",
          name:   "Tag as High Value",
          field:  { api_name: "Booking_Status" },
          value:  "Confirmed",
        },
      ],
      active: true,
    },
  ];

  for (const wf of workflows) {
    const result = await api("POST", "/settings/automation/workflow_rules", {
      workflow_rules: [wf],
    });
    ok(`Workflow: ${wf.name}`, result);
  }
}

// ─── 6. VERIFY: List modules ─────────────────────────────────────────────────

async function verifyModules() {
  console.log("\n🔍  Verifying created modules…");
  const result = await api("GET", "/settings/modules");
  if (result.ok && result.data.modules) {
    const custom = result.data.modules.filter(m => m.generated_type === "custom");
    console.log(`  Found ${result.data.modules.length} total modules, ${custom.length} custom:`);
    custom.forEach(m => console.log(`    • ${m.module_name} (${m.api_name})`));
  } else {
    console.warn("  Could not verify modules:", result.status);
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

(async () => {
  console.log("🚀  ROVER — Zoho CRM Setup");
  console.log(`    API: ${BASE}`);
  console.log(`    Token: ${ACCESS_TOKEN.slice(0, 20)}…\n`);

  try {
    // Modules
    await createExperiencesModule();
    await createBookingsModule();

    // Fields
    await createExperienceFields();
    await createBookingFields();
    await addContactFields();
    await addAccountFields();

    // Workflows
    await createWorkflows();

    // Verify
    await verifyModules();

    console.log("\n✅  Setup complete! Your ROVER CRM structure is ready.");
    console.log("    → Open Zoho CRM → Modules → to see Experiences and Bookings");
  } catch (err) {
    console.error("\n❌  Setup failed:", err.message);
    process.exit(1);
  }
})();
