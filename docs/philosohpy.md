## Philosophy

Usecases-ui is not designed with Next.js in mind; in fact, it competes with the idea of using Next.js to model all the
use cases of the UI. Regarding the use cases with which usecases-ui competes:

Entrypoint
In Next.js, to start an experience, a user clicks on a link (external or internal within the app) to access a Next.js "
route". On this route, the user performs a series of actions to achieve their goal. As the user moves within the
application, whether the different views represent a route or not is not very useful. Only the user's entry into the
application can be facilitated by this routing system. The user can also save a "link" for reuse if the route points to
static content, but if the route is part of a flow with a beginning and an end, then it's not very useful to distinguish
between the different routes that this flow touches, as the user will generally have to start from the initial route (to
which they may or may not be redirected). In line with this, we can say that the routing system is more useful for the
distribution of static experiences, organized similarly to a static website (an objective that this routing system seeks
to simulate). Using React, these experiences are enriched, of course, and Next.js is a way to distribute React
experiences on different routes.

In UsecasesUI, the aim is to distribute React experiences not in routes, but in "usecases". A usecase in itself is a
tree, similar to a routing tree in Next.js, but "usecases-ui" is not limited to the structure of a single Next.js
instance. In fact, a single "usecase" could "simulate" a complete instance of an application organized in routes. What's
innovative is that the structure is totally dynamic:

When designing a "page", it is not necessary for it to be relegated to a structure like a sub-page of a route. A view
or "task" in usecases-ui is completely decoupled from the rest, in line with the principles of OOP.
Additionally, regarding OOP, a "task" in usecases-ui can receive dependencies in the style of OOP, or "slots". This task
expects these slots to comply with a certain interface, and that's all it needs. There's no such concept in Next.js with
equal dynamism. Pages in Next.js can receive Props and communicate between Pages via Links, but they are still coupled
within a routing structure. It's not ruled out that it's possible to generate a similar experience in Next.js or with
React Router, but usecases-ui is OOP friendly out of the box.
The business that distributes the experience to the customer is the expert on its own platform, and in this sense, it's
not true that "The customer is always right". The customer doesn't know what they want to do on the platform, but rather
the platform itself offers them certain pathways in which the business can provide value to the customer. "Welcome to my
platform, I can provide value to you in these ways "A" "B" and "C", feel free to choose what you prefer. And since
experiences A, B, and C are dependent on the context of the customer and the business, this turns out to be an ideal use
case for usecases-ui, where a series of "usecases" are offered to the customer representing the ways in which value can
be added by the business.
On the contrary, in Next.js or with conventional routing, one-size-fits-all turns out to be both a blessing and a curse.
The general way in which the user will increase their value is that they themselves will have to search for what they
want to do (initial loss of value in unknown opportunities), and they will do it inefficiently unless they are an expert
on the application. And even if they are an expert on the application, they would do it less efficiently.

In usecases-ui, depending on the flow chosen, the experience can be easily designed to be distraction-free, efficient,
easy. And through the distribution of the different flows, it also turns out to be opportunity-loss-free (and even more
noise-free and efficient).

While creating all the building blocks of a UsecasesUI can take time, once they are ready, it is possible to create
different flows without touching code.

In Next.js, development is contextual with respect to a particular flow, and this forces it to be generalized. In
usecases-ui, development is only contextual with respect to the interface of an experience block, to be reused in
multiple flows.