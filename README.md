A simple Postgresql database viewer for linux, specifically debian and redhat
distros. Developed over a week as a Stackathon projectwhile
attending Full Stack Acedemy.

In the 'Downlods-Here' folder you will find executables for Debian (Ubuntu Pop! OS, etc) and RedHat (Fedora, Future OS, etc) distros.

On launch, this application looks for a running postgres server called `postgres://localhost`. If found, it will render the default postgres database and provide a menu to render any other databases with 'USER' set to 'all' and
'METHOD' set to 'trust'.

Version 2.1 adds a refresh button and automatic sorting that sorts by ID (previously, sorting was done by the last time the data was updated). Future updates will include sorting by column paramaters.
