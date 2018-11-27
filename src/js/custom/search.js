import makeSliders from './slider';

$(() => {
    if ($('.referenser-list').length !== 0) {
        var lunrIndex,
            $results = $(".referenser-list .c-searchForm__results"),
            pagesIndex;

        const
            sliderHTML = $.parseHTML(`
                <div class="mw8 center c-partialProjectSlider">
                    <button class="c-partialProjectSlider__leftButton"><</button>

                    <div class="c-partialProjectSlider__frame">
                        <ul class="c-partialProjectSlider__wrapper"></ul>
                    </div>

                    <button class="c-partialProjectSlider__rightButton">></button>
                </div>`);

        // Initialize lunrjs using our generated index file
        function initLunr() {

            // First retrieve the index file
            $.getJSON("/js/lunr/PagesIndex.json")
                .done(index => {
                    pagesIndex = index;

                    // Set up lunrjs by declaring the fields we use
                    // Also provide their boost level for the ranking
                    lunrIndex = lunr(function() {
                        this.field("title", {
                            boost: 10
                        });
                        this.field("content", {
                            boost: 5
                        });
                        this.field("category");
                        this.field("project_titles");

                        // ref is the result item identifier (I chose the page URL)
                        this.ref("href");
                    });

                    pagesIndex.map(pageMapper).forEach(page => {
                        lunrIndex.add(page);
                    });
                })
                .fail((jqxhr, textStatus, error) => {
                    var err = textStatus + ", " + error;
                    console.error("Error getting Hugo index file:", err);
                });
        }

        function pageMapper(page) {
            let projectTitles= page.projects.map(project => {
                return project.title;
            });

            return {
                "title": page.title,
                "content": page.content,
                "category": page.category,
                "href": page.href,
                "project_titles": projectTitles
            }
        }

        // Nothing crazy here, just hook up a listener on the input field
        function initUI() {
            $("#search").keyup(() => {
                var query = $("#search").val();
                var results = search(query);

                // Only trigger a search when 2 chars. at least have been provided
                if (query.length < 2) {
                    return;
                }

                $results.empty();
                renderResults(results, query);
            });

            $("#category").change(() => {
                var query = $("#category").val();
                var results = search(query);

                $results.empty();
                $("#sub-category option:first").prop('selected',true);
                renderResults(results, query);
            });

            $("#sub-category").change(() => {
                var query = $("#sub-category").val();
                var results = search(query);

                $results.empty();
                $("#category option:first").prop('selected',true);
                renderResults(results, query);
            });
        }

        /**
         * Trigger a search in lunr and transform the result
         *
         * @param  {String} query
         * @return {Array}  results
         */
        function search(query) {
            // Find the item in our index corresponding to the lunr one to have more info
            // Lunr result:
            //  {ref: "/section/page1", score: 0.2725657778206127}
            // Our result:
            //  {title:"Page1", href:"/section/page1", ...}
            return lunrIndex.search(query).map(result => {
                return pagesIndex.filter(page => {
                    if (page) {
                        return page.href === result.ref;
                    }
                })[0];
            });
        }

        /**
         * Display the 10 first results
         *
         * @param  {Array} results to display
         */
        function renderResults(results, query) {
            if (!results.length) {
                noResults(query);
                return;
            }

            $results.empty();

            // Only show the ten first results
            results.forEach(result => {
                $(result.projects).each((index, project) => {
                    let sliderHTML = $.parseHTML(`
                    <li style="width: 100%">
                        <h3 class="f3 b lh-title mb2 black">
                            ${project.title}
                        </h3>
                        <div class="mw8 center c-partialProjectSlider">
                            <button class="c-partialProjectSlider__leftButton"><</button>

                            <div class="c-partialProjectSlider__frame">
                                <ul class="c-partialProjectSlider__wrapper"></ul>
                            </div>

                            <button class="c-partialProjectSlider__rightButton">></button>
                        </div>
                    </li>`);

                    $(project.images).each((index, image) => {
                        let imageText = image.text || '';

                        $(sliderHTML).find('.c-partialProjectSlider__wrapper').append(`
                        <li>
                            <a target="_blank" href="${image.image}" class="c-partialProjectSlider__project">
                                <img src="${image.image}" alt="Project image">
                                ${imageText}
                            </a>
                        </li>`);
                    });

                    $('.referenser-list .flex.flex-wrap').append(sliderHTML);
                });
            });

            // Set up sliders
            makeSliders();
        }

        function noResults(query) {
            $results.html(`<h3>Inga resultat hittades för "${query}".</h3>`);
        }

        // Let's get started
        initLunr();

        $(document).ready(() => {
            initUI();
        });
    }
});
