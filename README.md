# oscar-winners-viz

Visualizing the makeup of Oscar-winning and Oscar-nominated actors and actresses through the years. 
A final project for Compsci 171, Fall 2020.
Josh Villarreal, Michaela Donato, and Jackie Walzer.

You can find our process book at the following <a href="https://docs.google.com/document/d/1e8gJDs7d25U-E5SKizLKKor6LjmbjRTPTelMwxdRuVs/edit?usp=sharing">Google Drive link</a>, our two-minute presentation video at this <a href="https://youtu.be/qIc_IyRazk8">Youtube link</a>, and the final version of our website <a href="https://joshv2017.github.io/oscar-winners-viz/webpage-dev/">here</a>.

## The data

You can find all data acquisition in the Python notebook `data-creation.ipynb`, in the `python-notebooks` directory. The data that we use for this visualization project comes from two sources:
- The data on actors and actresses and the Oscars they were nominated for/won comes from the official <a href="http://awardsdatabase.oscars.org/">Official Academy Awards Database</a>. This website provides listings of all awards handed out since the first annual Academy Awards, and we scraped the results page of the website for awards pertaining to Best Actor/Actress. You can find this scraped data in the file `data/awards.csv`.
- The data on actors and actresses and their biographical information comes from <a href="https://www.imdb.com/">IMDb</a>, and the data acquisition is done using the <a href="https://buildmedia.readthedocs.org/media/pdf/imdbpy/latest/imdbpy.pdf">IMDbPY</a> Python module. We can access biographies, birthdate/birthplace information, and complete filmographies of each actor that was nominated for an Oscar. You can find this acquired data in the file `data/actors.csv`.
---
## What this repository consists of
