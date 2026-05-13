# Technical Notes By Library

## helmet

Helmet applies secure-by-default HTTP response headers in Express applications.
It helps reduce attack surface for clickjacking, MIME sniffing, and reflected content risks.
In this project, it is used as an early middleware in the API bootstrap path.

## @radix-ui/react-dialog

Radix Dialog provides accessible modal primitives with focus trap and ARIA semantics.
It decouples behavior from styling, enabling custom visual identity without losing accessibility.
For this project, it is the planned base for admin confirmation and edit workflows.

## @radix-ui/react-avatar

Radix Avatar standardizes user/media fallback rendering with robust loading states.
It is useful for profile display in topbar and admin presence contexts.
The primitive supports accessible image semantics while preserving custom styling.
