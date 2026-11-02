# Experiment 3 - TechFest 2026 Portal as a React SPA

## Component tree
```
main.jsx  (BrowserRouter > ThemeProvider > CartProvider)
└── App
    ├── Navbar          (Links, cart badge, theme button)
    └── Routes
        ├── /              Home          (useEffect + fetch: Loading / Error)
        ├── /events        Events        (search + category + sort state)
        │                   └── EventList
        │                        └── EventCard  (seatsLeft state, Add to Cart)
        ├── /register      Registration  (controlled form, regex validation)
        ├── /confirmation  Confirmation
        ├── /gallery       Gallery
        ├── /contact       Contact
        ├── /cart          Cart          (CartContext)
        └── *              NotFound
```

## Hooks used and their purpose
| Hook | Where | Purpose |
|---|---|---|
| useState | EventCard, Events, Registration, Home, both Providers | Holds changing data: seatsLeft, search/category/sort, form fields and errors, posts/loading/error, theme, cart |
| useEffect | Home | Runs the API fetch once after the page first renders (empty dependency array) |
| useContext | useTheme(), useCart() | Reads theme and cart anywhere without prop drilling |
| useNavigate | Registration | Moves to /confirmation after a valid submit, without reload |
| useLocation | Confirmation | Reads the name passed from the registration form |

## Regular expressions
- Email `^\S+@\S+\.\S+$` : text@text.text shape
- Mobile `^[6-9]\d{9}$` : 10 digits starting with 6-9

## Requirement mapping
1 components/ | 2 pages/ | 3 Routes + Link | 4 data/events.js + EventList | 5 Registration.jsx |
6 Home.jsx (fetch, Loading, Error) | 7 ThemeContext + Navbar | 8 Events.jsx (search, filter, sort) |
9 useState + two Contexts | 10 folder layout (components, pages, context, data)

## Run
npm install && npm run dev  ->  http://localhost:5173
