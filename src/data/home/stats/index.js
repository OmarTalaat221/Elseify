

export const viewOptions = [
    { key: "all", icon: "🌟", label: "All Time" },
    { key: "day", icon: "🗓️", label: "Day" },
    { key: "month", icon: "📅", label: "Month" },
    { key: "year", icon: "🕰️", label: "Year" },
  ];
  
  export const datePickers = [
    {
      key: "day",
      type: "date",
      value: (date) => date.day,
      onChange: (e, setDate, date) => setDate({ ...date, day: e.target.value }),
    },
    {
      key: "month",
      type: "month",
      value: (date) => date.month,
      onChange: (e, setDate, date) => setDate({ ...date, month: e.target.value }),
    },
    {
      key: "year",
      type: "number",
      value: (date) => date.year,
      onChange: (e, setDate, date) => setDate({ ...date, year: e.target.value }),
      min: "2000",
      max: new Date().getFullYear(),
    },
    {
      key: "all",
      type: "text",
      content: (
        <span className="text-success" style={{ fontWeight: "900" }}>
          All Time
        </span>
      ),
    },
  ];
  